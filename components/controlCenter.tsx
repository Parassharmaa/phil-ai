import { useState } from "react"

const ControlCenter = ({ onGo }) => {
  const [data, setData] = useState("")
  return (
    <div>
      {/* add input box */}
      <div className="flex w-full max-w-sm items-center space-x-2">
        <input
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input  px-3 py-2 text-sm"
          placeholder="Enter goal or explain a task"
          type="text"
        />
        <button
          onClick={() => {
            onGo(data)
          }}
          className="items-center rounded-full text-white justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-blue-500 bg-blue-400 h-10 px-4 py-2"
          type="submit">
          Go
        </button>
      </div>
    </div>
  )
}

export default ControlCenter
