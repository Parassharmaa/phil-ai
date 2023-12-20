import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

const MagicFill = ({ onDone }) => {
  const [magicFillContext, setMagicFillContext] = useStorage(
    "magicFillContext",
    ""
  )

  return (
    <div>
      {/* add input box */}
      <div className="w-full max-w-sm items-center flex flex-col space-y-2">
        <textarea
          defaultValue={magicFillContext}
          onChange={(e) => setMagicFillContext(e.target.value)}
          className="flex w-full rounded-md border border-input  px-3 py-2 text-sm content-stretch h-52"
          placeholder="Enter details or Context (Optional)"
        />
        <button
          onClick={() => {
            onDone(magicFillContext)
          }}
          className="w-full rounded-full text-white items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-blue-500 bg-blue-400 h-10 px-4 py-2"
          type="submit">
          Fill
        </button>
      </div>
    </div>
  )
}

export default MagicFill
