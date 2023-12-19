import cssText from "data-text:~style.css"
import OpenAI from "openai"
import type { PlasmoCreateShadowRoot, PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"
import CursorImage from "react:~assets/cursor.svg"

import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"

import ControlCenter from "~components/controlCenter"
import Cursor from "~components/cursor"
import { isInteractive } from "~utils"
import { browserOperator } from "~utils/prompts"

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

const AutoFill = () => {
  const [cursPos, setCursPos] = useState({
    x: null,
    y: null
  })
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
      const width = window.innerWidth / 2
      const height = window.innerHeight / 2

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)
      const resizedImage = canvas.toDataURL()

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
                  url: resizedImage,
                  detail: "low"
                }
              }
            ]
          }
        ]
      })

      const action = res.choices[0].message.content

      console.log(action)

      if (action.startsWith("GOTO")) {
        const description = JSON.parse(action.split("GOTO")[1].trim())

        const { x, y } = description

        const windowX = window.innerWidth * (parseFloat(x) / 100)

        const windowY = window.innerHeight * (parseFloat(y) / 100)

        console.log(windowX, windowY)

        setCursPos({
          x: windowX,
          y: windowY
        })
      } else if (action.startsWith("TYPE")) {
        const description = JSON.parse(action.split("TYPE")[1].trim())

        const { text } = description

        const el = document.elementFromPoint(
          cursPos.x,
          cursPos.y
        ) as HTMLInputElement

        if (el) {
          simulateTyping(el, text)
        }
      }
    }

    // send to open ai and get actions

    // perform actions on the dom

    // scroll down and recursivelly call this function

    // if cannot scroll down, exit
  }

  useMessage<string, string>(async (req, res) => {
    if (req.name === "go") {
      await startTask(req.body)
    }
  })

  const simulateBackspace = (element) => {
    // Create a 'keydown' event for the backspace key
    var backspaceEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Backspace",
      code: "Backspace",
      keyCode: 8
    })

    // Dispatch the event
    element.dispatchEvent(backspaceEvent)

    // Manually remove the last character from the input field's value
    element.value = element.value.substring(0, element.value.length - 1)

    // Trigger change event after backspace is simulated
    var changeEvent = new Event("change")
    element.dispatchEvent(changeEvent)
  }

  const simulateTyping = (element, text) => {
    text.split("").forEach(function (char) {
      // Create a 'keydown' event
      var keydownEvent = new KeyboardEvent("keydown", {
        key: char,
        keyCode: char.charCodeAt(0),
        code: char.charCodeAt(0),
        which: char.charCodeAt(0),
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
      })

      // Create a 'keypress' event
      var keypressEvent = new KeyboardEvent("keypress", {
        key: char,
        keyCode: char.charCodeAt(0),
        code: char.charCodeAt(0),
        which: char.charCodeAt(0),
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
      })

      // Create a 'keyup' event
      var keyupEvent = new KeyboardEvent("keyup", {
        key: char,
        keyCode: char.charCodeAt(0),
        code: char.charCodeAt(0),
        which: char.charCodeAt(0),
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
      })

      // Dispatch the events
      element.dispatchEvent(keydownEvent)
      element.value += char // Directly set the value of the element
      element.dispatchEvent(keypressEvent)
      element.dispatchEvent(keyupEvent)
    })

    // Trigger change event after typing is complete
    var changeEvent = new Event("change")
    element.dispatchEvent(changeEvent)
  }

  return (
    <div>
      <Cursor x={cursPos.x} y={cursPos.y} />
    </div>
  )
}

export default AutoFill
