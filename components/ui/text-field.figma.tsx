import figma from "@figma/code-connect"
import { TextField } from "./text-field"

figma.connect(TextField, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=3667:2676", {
  props: {
    label: figma.string("contentLabel"),
    error: figma.enum("error", {
      on: "Error message",
    }),
    helpText: figma.boolean("helptext", {
      true: "Helper text",
      false: undefined,
    }),
    disabled: figma.enum("state", {
      "filled disabled": true,
      "outfocus disabled": true,
    }),
  },
  example: (props) => (
    <TextField
      label={props.label}
      error={props.error}
      helpText={props.helpText}
      disabled={props.disabled}
      placeholder="Content"
    />
  ),
})
