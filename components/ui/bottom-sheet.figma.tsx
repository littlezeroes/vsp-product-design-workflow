import figma from "@figma/code-connect"
import { BottomSheet } from "./bottom-sheet"

figma.connect(BottomSheet, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=5966:3791", {
  props: {
    height: figma.enum("height", {
      "Max height": "max",
      "Hug content": "hug",
    }),
  },
  example: (props) => (
    <BottomSheet open={true} onClose={() => {}}>
      {/* Sheet content */}
    </BottomSheet>
  ),
})
