import figma from "@figma/code-connect"
import { InformMessage } from "./inform-message"

figma.connect(InformMessage, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=3667:3587", {
  props: {
    hierarchy: figma.enum("hierarchy", {
      primary: "primary",
      secondary: "secondary",
    }),
  },
  example: (props) => (
    <InformMessage
      hierarchy={props.hierarchy}
      body="Lorem ipsum dolor sit amet consectetur."
      actionLabel="Label"
    />
  ),
})
