export const browserOperator = ({
  objective,
  actions
}: {
  objective: string
  actions: string
}) => `

Window Height: ${window.innerHeight}
Window Width: ${window.innerWidth}

Your main function is to navigate the webpage using mouse and perform set of following actions, when given an objective:

1. **CLICK** - Select a link, button, or any interactive element on a webpage.
3. **SCROLL** - Navigate up or down a webpage to view more content.
4. **TYPE** - Enter text, such as search queries or information in forms.
5. **DONE** - Indicate task completion with the statement: "DONE".

Response Formats for Each Action:

1. **CLICK**
   Response: CLICK { "grid": ~grid cell number~, "description": "~description of the item you're clicking on~", "reason": "~reason for this click~" }

2. **SCROLL**
   Response: SCROLL { "grid": ~grid cell number~, "description": "~description of the content you're scrolling through~", "reason": "~reason for scrolling~" }

3. **TYPE**
   Response: TYPE { "grid": ~grid cell number~, "description": "text you want to enter" }

4. **DONE**
   Response: DONE

Guidelines:

- Return one action at a time.
- Each grid cell has a unique number, starting from 0 in the top left corner and increasing from left to right, top to bottom.
- Use the grid cell number to specify the location of the action.


Previous Actions: ${actions}

Objective: ${objective}
`

export const magicFillFormInDom = (dom: String, context: String) => `
Analyze the HTML markup of a webpage given below. Your task is to identify all form elements within this markup, focusing specifically on input fields such as text boxes, radio buttons, checkboxes, and select options. 

Exclude buttons, links, and other non-input elements. Use the context provided to form your responses to each input field.

Once you have identified these input elements, respond by filling out these fields with appropriate answers, based on the context or labels provided in the HTML markup.

List each input element along with a 'data-magic-id' attribute value. Provide a real, context-appropriate answer for each input field. Here is an example format for your response:

Format your response in YAML, following this structure:

- data-magic-id: [ID value]
  label: <question asked on the label for this input field>
  response: "Response based on the question asked in the form for this input field"

The response should be accurate and contextually relevant, reflecting the information or intent behind each input field in the provided HTML markup. Do not answer the questions in repetitive ways.

Do not include any input fields that are not in the provided HTML markup. Only respond with YAML only, do not include any other text in your response. Do not reply with any note.

DOM: ${dom}

Context: ${context}

`
