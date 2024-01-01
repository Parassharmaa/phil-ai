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

export const isVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element)
  return (
    style.opacity !== "" &&
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    element.getAttribute("aria-hidden") !== "true"
  )
}

export const traverseDOM = (node: Node, pageElements: HTMLElement[]) => {
  const clonedNode = node.cloneNode(false) as Node

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as HTMLElement

    const clonedElement = clonedNode as HTMLElement

    pageElements.push(element)
    clonedElement.setAttribute("data-id", (pageElements.length - 1).toString())
    clonedElement.setAttribute(
      "data-interactive",
      isInteractive(element).toString()
    )
    clonedElement.setAttribute("data-visible", isVisible(element).toString())
  }

  node.childNodes.forEach((child) => {
    const result = traverseDOM(child, pageElements)
    clonedNode.appendChild(result.clonedDOM)
  })

  return {
    pageElements,
    clonedDOM: clonedNode
  }
}

export const getAnnotatedDOM = () => {
  const currentElements = []

  // add random [data-pe-idx] attributes to each element in the DOM
  document.querySelectorAll("*").forEach((element) => {
    element.setAttribute(
      "data-magic-id",
      Math.floor(Math.random() * 10000).toString()
    )
  })

  const result = traverseDOM(document.documentElement, currentElements)
  return (result.clonedDOM as HTMLElement).outerHTML
}

export const getSimplifiedDom = () => {
  const fullDom = getAnnotatedDOM()
  if (!fullDom) return null

  const dom = new DOMParser().parseFromString(fullDom, "text/html")

  const interactiveElements: HTMLElement[] = []

  const simplifiedDom = generateSimplifiedDom(
    dom.documentElement,
    interactiveElements
  ) as HTMLElement

  return simplifiedDom
}

export const generateSimplifiedDom = (
  element: ChildNode,
  interactiveElements: HTMLElement[]
): ChildNode | null => {
  if (element.nodeType === Node.TEXT_NODE && element.textContent?.trim()) {
    return document.createTextNode(element.textContent + " ")
  }

  if (!(element instanceof HTMLElement || element instanceof SVGElement))
    return null

  const isVisible = element.getAttribute("data-visible") === "true"
  if (!isVisible) return null

  let children = Array.from(element.childNodes)
    .map((c) => generateSimplifiedDom(c, interactiveElements))
    .filter((c) => c !== null) as ChildNode[]

  if (element.tagName === "BODY")
    children = children.filter((c) => c.nodeType !== Node.TEXT_NODE)

  const interactive =
    element.getAttribute("data-interactive") === "true" ||
    element.hasAttribute("role")
  const hasLabel =
    element.hasAttribute("aria-label") || element.hasAttribute("name")
  const includeNode = interactive || hasLabel

  if (!includeNode && children.length === 0) return null
  if (!includeNode && children.length === 1) {
    return children[0]
  }

  const container = document.createElement(element.tagName)

  const allowedAttributes = [
    "aria-label",
    "data-name",
    "name",
    "type",
    "placeholder",
    "value",
    "role",
    "title",
    "data-magic-id"
  ]

  for (const attr of allowedAttributes) {
    if (element.hasAttribute(attr)) {
      container.setAttribute(attr, element.getAttribute(attr) as string)
    }
  }
  if (interactive) {
    interactiveElements.push(element as HTMLElement)
  }

  children.forEach((child) => container.appendChild(child))

  return container
}

export const simulateBackspace = (element) => {
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

export const simulateTyping = (element, text) => {
  text?.split("").forEach((char) => {
    // Create a 'keydown' event
    var event = new KeyboardEvent("keydown", { key: char, bubbles: true })

    element.dispatchEvent(event)

    // trigger on change
    var changeEvent = new Event("change", { bubbles: true })
    element.value += char
  })

  // Trigger change event after typing is complete
  var changeEvent = new Event("change", { bubbles: true })
  element.dispatchEvent(changeEvent)
}
