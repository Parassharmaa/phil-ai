import cssText from "data-text:~style.css"
import type { PlasmoCreateShadowRoot, PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"
import CursorImage from "react:~assets/cursor.svg"

import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"

import Cursor from "~components/cursor"
import { isInteractive } from "~utils"

export const config: PlasmoCSConfig = {
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const createShadowRoot: PlasmoCreateShadowRoot = (shadowHost) =>
  shadowHost.attachShadow({ mode: "open" })

const AutoFill = () => {
  const phil = async () => {
    const data = await sendToBackground({
      name: "captureTab"
    })

    // send to open ai and get actions

    // perform actions on the dom

    // scroll down and recursivelly call this function

    // if cannot scroll down, exit
  }

  useMessage<string, string>(async (req, res) => {
    if (req.name === "request-phil") {
      await phil()
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

  const [cursPos, setCursPos] = useState({
    x: 0,
    y: 0
  })

  // useEffect(() => {
  //   const onMouseMove = (e: MouseEvent) => {
  //     const { clientX, clientY } = e
  //     setCursPos({
  //       x: clientX,
  //       y: clientY
  //     })
  //   }
  //   window.addEventListener("mousemove", onMouseMove)

  //   // animate the position of the cursor

  //   return () => {
  //     window.removeEventListener("mousemove", onMouseMove)
  //   }
  // }, [cursPos])

  useEffect(() => {
    const el = document.elementFromPoint(
      cursPos.x,
      cursPos.y - 12
    ) as HTMLElement

    // hide cursor for el
    if (el) {
      // simulate mouse hover for el if it is interactive
    }
  }, [cursPos])

  // randomly move the cursor around

  return (
    <div>
      <Cursor />
    </div>
  )
}

export default AutoFill
