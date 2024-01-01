import { sendToContentScript } from "@plasmohq/messaging"

import "./style.css"

import { useState } from "react"

import ControlCenter from "~components/controlCenter"
import MagicFill from "~components/magicFill"

function IndexPopup() {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <div
      style={{
        display: "flex",
        width: "400px",
        minHeight: "400px",
        flexDirection: "column",
        padding: 16
      }}>
      <div className="items-center rounded-lg flex justify-between">
        <div
          className={`text-lg text-blue-600 ${
            tabIndex === 0 ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"
          } rounded-md mx-2 w-full text-center cursor-pointer`}
          onClick={() => {
            setTabIndex(0)
          }}>
          Magic Fill
        </div>

        <div
          className={`text-lg text-blue-600 ${
            tabIndex === 1 ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"
          } rounded-md mx-2 w-full text-center cursor-pointer `}
          onClick={() => {
            setTabIndex(1)
          }}>
          Assist
        </div>
      </div>

      <div className="py-4">
        {tabIndex === 0 && (
          <div>
            <MagicFill
              onDone={(body) => {
                sendToContentScript({ name: "magicFillStatus", body })
              }}
              onContextSet={(body) => {
                sendToContentScript({ name: "magicFillContext", body })
              }}
            />
          </div>
        )}
        {tabIndex === 1 && (
          <ControlCenter
            onGo={(data) => {
              sendToContentScript({ name: "go", body: data })
            }}
          />
        )}
      </div>
    </div>
  )
}

export default IndexPopup
