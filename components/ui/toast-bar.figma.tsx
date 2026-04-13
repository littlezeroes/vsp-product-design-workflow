import figma from "@figma/code-connect"
import { ToastBar } from "./toast-bar"

figma.connect(ToastBar, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=5122:14467", {
  props: {
    type: figma.enum("type", {
      "Default": "default",
      "Error": "error",
      "Success": "success",
    }),
  },
  example: (props) => (
    <ToastBar
      type={props.type}
      title="Title"
      body="Message content"
      onClose={() => {}}
    />
  ),
})
