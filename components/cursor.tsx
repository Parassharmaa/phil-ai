import { useRef } from "react"
import CursorImage from "react:~assets/cursor.svg"

const Cursor = ({ x, y }) => {
  const cursorRef = useRef()

  if (!x || !y) {
    return <div />
  }

  return (
    <div>
      <div
        ref={cursorRef}
        className={`w-10 h-10 fixed transition-all duration-1000`}
        style={{
          left: x,
          top: y
        }}>
        <CursorImage />
      </div>
    </div>
  )
}

export default Cursor
