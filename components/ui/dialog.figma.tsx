import figma from "@figma/code-connect"
import { Dialog } from "./dialog"

figma.connect(Dialog, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=4457:722", {
  props: {
    type: figma.enum("type", {
      default: "default",
      "Icon": "icon",
      "Image": "image",
    }),
    title: figma.string("contentTitle"),
    description: figma.string("contentDescription"),
  },
  example: (props) => (
    <Dialog
      open={true}
      type={props.type}
      title={props.title}
      description={props.description}
      primaryLabel="Confirm"
      secondaryLabel="Cancel"
      onClose={() => {}}
    />
  ),
})
