import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {}

export type RequestResponse = string

const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  RequestResponse
> = async (req, res) => {
  //   capture tab
  const tab = await chrome.tabs.captureVisibleTab()

  res.send(tab)
}

export default handler
