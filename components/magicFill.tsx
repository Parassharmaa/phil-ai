import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

const MagicFill = ({ onDone, onContextSet }) => {
  const [magicFillStatus, setMagicFillStatus] = useStorage(
    "magicFillStatus",
    "off"
  )

  const [magicFillContext, setMagicFillContext] = useStorage(
    "magicFillContext",
    ""
  )

  useEffect(() => {
    if (magicFillStatus === "on") {
      onDone("on")
    } else {
      onDone("off")
    }
  }, [magicFillStatus])

  return (
    <div>
      <div className="w-full max-w-sm  space-y-2 m-4">
        <div className="flex items-center">
          <input
            id="magicFill"
            type="checkbox"
            className="form-checkbox h-5 w-5 text-gray-600"
            checked={magicFillStatus === "on"}
            onChange={(e) => {
              if (e.target.checked) {
                setMagicFillStatus("on")
              } else {
                setMagicFillStatus("off")
              }
            }}
          />
          <label
            htmlFor="magicFill"
            className="ml-2 block text-sm text-gray-900">
            Toggle On/Off
          </label>
        </div>
      </div>

      {magicFillStatus === "on" && (
        <div className="w-full max-w-sm items-center flex flex-col space-y-2">
          <textarea
            defaultValue={magicFillContext}
            onChange={(e) => {
              setMagicFillContext(e.target.value)
              onContextSet(e.target.value)
            }}
            className="flex w-full rounded-md border border-input  px-3 py-2 text-sm content-stretch h-52"
            placeholder="Enter details or Context (Optional)"
          />
        </div>
      )}
    </div>
  )
}

export default MagicFill
