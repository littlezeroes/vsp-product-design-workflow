import figma from "@figma/code-connect"
import { Checkbox } from "./checkbox"

figma.connect(Checkbox, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=4608:7076", {
  props: {
    checked: figma.enum("◐  Checked", {
      "True": true,
      "False": false,
    }),
    indeterminate: figma.enum("↳ Type", {
      "Indeterminate": true,
    }),
    disabled: figma.enum("◐ Disabled", {
      "True": true,
      "False": false,
    }),
  },
  example: (props) => (
    <Checkbox
      checked={props.checked}
      indeterminate={props.indeterminate}
      disabled={props.disabled}
    />
  ),
})
