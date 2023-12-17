import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"
import CursorImage from "react:~assets/cursor.svg"

export const config: PlasmoCSConfig = {
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const Cursor = () => {
  const cursorRef = useRef()

  const [cursPos, setCursPos] = useState({
    x: 0,
    y: 0
  })

  useEffect(() => {
    const move = setInterval(() => {
      const { clientWidth, clientHeight } = document.documentElement
      const x = Math.random() * clientWidth
      const y = Math.random() * clientHeight

      setCursPos({
        x,
        y
      })
    }, 1000)

    return () => {
      clearInterval(move)
    }
  }, [])

  return (
    <div>
      <div
        ref={cursorRef}
        className={`w-10 h-10 fixed transition-all duration-1000`}
        style={{
          left: cursPos.x,
          top: cursPos.y - 10
        }}>
        <CursorImage />
      </div>
    </div>
  )
}

export default Cursor
