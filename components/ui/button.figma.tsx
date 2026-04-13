import figma from "@figma/code-connect"
import { Button } from "./button"

figma.connect(Button, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=3549:5585", {
  props: {
    variant: figma.enum("hierarchy", {
      primary: "primary",
      secondary: "secondary",
    }),
    intent: figma.enum("type", {
      default: "default",
      danger: "danger",
    }),
    size: figma.enum("size", {
      "48": "48",
      "32": "32",
    }),
    disabled: figma.enum("state", {
      disabled: true,
    }),
    isLoading: figma.enum("state", {
      loading: true,
    }),
    children: figma.string("label"),
  },
  example: (props) => (
    <Button
      variant={props.variant}
      intent={props.intent}
      size={props.size}
      disabled={props.disabled}
      isLoading={props.isLoading}
    >
      {props.children}
    </Button>
  ),
})
