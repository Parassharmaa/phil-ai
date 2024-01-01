import cssText from "data-text:~style.css"
import OpenAI from "openai"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
import { parse } from "yaml"

import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"

import Cursor from "~components/cursor"
import { getSimplifiedDom, isInteractive, simulateTyping } from "~utils"
import { browserOperator, magicFillFormInDom } from "~utils/prompts"

const openai = new OpenAI({
  apiKey: process.env.PLASMO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export const config: PlasmoCSConfig = {
  all_frames: false
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const divisions = 20

const AutoFill = () => {
  const [cursPos, setCursPos] = useState({
    x: null,
    y: null
  })

  const [isAnalysing, setIsAnalysing] = useState(false)

  const startTask = async (task) => {
    const data = await sendToBackground({
      name: "captureTab"
    })

    // resize the data image to 256x256
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    let img = new Image()
    img.src = data
    img.onload = async () => {
      // scale down the res based on acutal window size
      const width = window.innerWidth / 1.5
      const height = window.innerHeight / 1.5

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)
      const resizedImage = canvas.toDataURL()

      // draw grid on the image
      ctx.strokeStyle = "gray"
      ctx.lineWidth = 0.5

      for (let i = 0; i < width; i += width / divisions) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }

      for (let i = 0; i < height; i += height / divisions) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // add text label to each grid cell
      for (let i = 0; i < divisions * divisions; i++) {
        const x = (i % divisions) * (width / divisions)
        const y = Math.floor(i / divisions) * (height / divisions)

        ctx.font = "8px Arial"
        ctx.fillStyle = "gray"
        ctx.fillText(i.toString(), x + 5, y + 10)
      }
      // // get canvas data
      const data = canvas.toDataURL()

      // download the image using hidden anchor tag
      // const a = document.createElement("a")
      // a.href = data
      // a.download = "test.png"
      // a.click()
      // // hide the anchor tag
      // a.style.visibility = "hidden"

      // // append the image to the dom
      // const gridImg = document.createElement("img")
      // gridImg.src = data

      // document.body.appendChild(gridImg)

      const res = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        max_tokens: 3000,
        messages: [
          {
            role: "user",

            content: [
              {
                type: "text",
                text: browserOperator({
                  objective: task,
                  actions: ""
                })
              },
              {
                type: "image_url",
                image_url: {
                  url: data,
                  detail: "low"
                }
              }
            ]
          }
        ]
      })

      const action = res.choices[0].message.content

      console.log(action)

      let targetX = null
      let targetY = null
      if (action.startsWith("CLICK") || action.startsWith("TYPE")) {
        let content = { grid: null, description: null }
        if (action.startsWith("CLICK")) {
          content = JSON.parse(action.split("CLICK")[1].trim())
        } else if (action.startsWith("TYPE")) {
          content = JSON.parse(action.split("TYPE")[1].trim())
        }

        if (content.grid) {
          const { grid } = content

          // convert the grid number to x, y
          targetX = (grid % divisions) * (width / divisions)
          targetY = Math.floor(grid / divisions) * (height / divisions)

          console.log(targetX, targetY)

          setCursPos({
            x: targetX,
            y: targetY
          })
        }
        if (!content.description) {
          return
        }

        if (action.startsWith("CLICK")) {
          // click on the element
          const element = document.elementFromPoint(
            targetX,
            targetY
          ) as HTMLElement

          if (isInteractive(element)) {
            element.click()
          }
        } else {
          // type on the element
          const element = document.elementFromPoint(
            targetX,
            targetY
          ) as HTMLElement

          if (isInteractive(element)) {
            simulateTyping(element, content.description)
          }
        }
      }
    }
  }

  const magicAnalyse = async () => {
    setIsAnalysing(true)

    try {
      const dom = getSimplifiedDom()

      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        stream: true,
        temperature: 0.7,
        max_tokens: 3000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: magicFillFormInDom(dom.outerHTML)
              }
            ]
          }
        ]
      })

      let res = ""

      for await (const message of stream) {
        const delta = message.choices[0].delta.content || ""

        if (delta) {
          res += delta
        }
      }

      // parse
      const parsedRes = parse(res)

      // for all the keys with data-magic attribute, append a div with an icon
      parsedRes.forEach((item) => {
        const element = document.querySelector(
          `[data-magic-id="${item["data-magic-id"]}"]`
        )

        // check if the element is input or textarea and not hidden or submit
        if (
          element &&
          (element.tagName === "INPUT" || element.tagName === "TEXTAREA") &&
          element.getAttribute("type") !== "hidden" &&
          element.getAttribute("type") !== "submit" &&
          element.getAttribute("type") !== "checkbox" &&
          element.getAttribute("type") !== "radio" &&
          element.getAttribute("type") !== "button" &&
          element.getAttribute("type") !== "image" &&
          element.getAttribute("type") !== "reset" &&
          element.getAttribute("type") !== "file" &&
          element.getAttribute("type") !== "range" &&
          element.getAttribute("type") !== "color" &&
          element.getAttribute("type") !== "date"
        ) {
          if (element) {
            const magicElement = document.createElement("magic-fill")

            // set the data-magic-id attribute
            magicElement.setAttribute("dataMagicId", item["data-magic-id"])

            // set the data-magic-label attribute
            magicElement.setAttribute("dataMagicLabel", item["label"])

            // append after the element
            element.before(magicElement)
          }
        }
      })
    } catch (e) {
      console.log(e)
    }

    setIsAnalysing(false)
  }

  useMessage<string, string>(async (req, res) => {
    if (req.name === "go") {
      await startTask(req.body)
    }

    if (req.name === "magicFillStatus") {
      localStorage.setItem("magicFillStatus", req.body)
    }

    if (req.name === "magicFillContext") {
      localStorage.setItem("magicFillContext", req.body)
    }
  })

  const magicFillStatus = localStorage.getItem("magicFillStatus")

  const magicFillContext = localStorage.getItem("magicFillContext")

  if (magicFillStatus === "off") {
    return null
  }

  return (
    <div>
      {/* add button to trigger analyse  */}
      <button
        className="fixed top-0 left-0 p-2 m-2 bg-blue-500 text-white rounded"
        onClick={() => {
          magicAnalyse()
        }}>
        {isAnalysing ? "Analysing..." : `Analyse`}
      </button>
      <Cursor x={cursPos.x} y={cursPos.y} />
    </div>
  )
}

export default AutoFill
