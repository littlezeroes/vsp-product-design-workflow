import figma from "@figma/code-connect"
import { Tip } from "./tip"

figma.connect(Tip, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=5678:469", {
  example: () => (
    <Tip text="Tooltip content here">
      Underlined text
    </Tip>
  ),
})
