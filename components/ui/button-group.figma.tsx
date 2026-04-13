import figma from "@figma/code-connect"
import { ButtonGroup } from "./button-group"

figma.connect(ButtonGroup, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=63:215", {
  props: {
    layout: figma.enum("layout", {
      "Horizontal": "horizontal",
      "Vertical": "vertical",
    }),
  },
  example: (props) => (
    <ButtonGroup
      layout={props.layout}
      primaryLabel="Primary"
      secondaryLabel="Secondary"
    />
  ),
})
