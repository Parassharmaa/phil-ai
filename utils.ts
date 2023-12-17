export const isInteractive = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element)
  return (
    element.tagName === "A" ||
    element.tagName === "INPUT" ||
    element.tagName === "BUTTON" ||
    element.tagName === "SELECT" ||
    element.tagName === "TEXTAREA" ||
    element.hasAttribute("onclick") ||
    element.hasAttribute("onmousedown") ||
    element.hasAttribute("onmouseup") ||
    element.hasAttribute("onkeydown") ||
    element.hasAttribute("onkeyup") ||
    style.cursor === "pointer"
  )
}
