import figma from "@figma/code-connect"
import { Header } from "./header"
import { ChevronLeft } from "lucide-react"

figma.connect(Header, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=3922:994", {
  props: {
    variant: figma.enum("state", {
      "Default": "default",
      "Large Title": "large-title",
      "VP_Header": "vp-header",
    }),
    title: figma.string("title"),
    largeTitle: figma.string("largeTitle"),
  },
  example: (props) => (
    <Header
      variant={props.variant}
      title={props.title}
      largeTitle={props.largeTitle}
      leading={<ChevronLeft size={24} />}
    />
  ),
})
