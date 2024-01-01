import cssText from "data-text:~style.css"
import OpenAI from "openai"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { useState } from "react"

import { simulateTyping } from "~utils"

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () =>
  document.querySelectorAll("magic-fill")

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

const InputFillButton = ({ anchor }) => {
  const dataMagicId = anchor.element.getAttribute("dataMagicId")

  const label = anchor.element.getAttribute("dataMagicLabel")

  const [loading, setLoading] = useState(false)

  const magicFillContext = localStorage.getItem("magicFillContext")

  const fillInput = async () => {
    setLoading(true)
    const input = document.querySelector(`[data-magic-id="${dataMagicId}"]`)
    if (!input) {
      setLoading(false)
      return
    }

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        stream: true,
        max_tokens: 3000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Context: ${magicFillContext || "Empty"}
                Fill up the input field with the above context and below question:
                Question/Label: ${label}
                Response:`
              }
            ]
          }
        ]
      })

      for await (const message of stream) {
        const delta = message.choices[0].delta.content || ""

        if (delta) {
          simulateTyping(input, delta)
        }
      }
    } catch (e) {
      console.log(e)
    }

    setLoading(false)
  }

  return (
    <button onClick={fillInput} className="bg-blue-500 text-white rounded px-1">
      {loading ? "..." : ">"}
    </button>
  )
}

export default InputFillButton
