import { useState } from "react"

import { sendToContentScript } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"

function IndexPopup() {
  const [data, setData] = useState("")

  const requestPhil = async () => {
    sendToContentScript({
      name: "request-phil"
    })
  }

  useMessage<string, string>(async (req, res) => {
    setData(req.body)
  })

  return (
    <div
      style={{
        display: "flex",
        width: "400px",
        flexDirection: "column",
        padding: 16
      }}>
      <button onClick={requestPhil}>Fill</button>

      {data && (
        <div>
          <h3>Response</h3>
          <pre>{data}</pre>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
