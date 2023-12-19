import { sendToContentScript } from "@plasmohq/messaging"

import "./style.css"

import ControlCenter from "~components/controlCenter"

function IndexPopup() {
  return (
    <ControlCenter
      onGo={(data) => {
        sendToContentScript({
          name: "go",
          body: data
        })
      }}
    />
  )
}

export default IndexPopup
