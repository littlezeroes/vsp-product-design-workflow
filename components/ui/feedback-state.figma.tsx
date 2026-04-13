import figma from "@figma/code-connect"
import { FeedbackState } from "./feedback-state"

figma.connect(FeedbackState, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=5419:1287", {
  props: {
    type: figma.enum("type", {
      "Thành công": "success",
      "Fail": "fail",
      "In progress": "in-progress",
    }),
  },
  example: (props) => (
    <FeedbackState
      title="Xác thực thành công"
      description="Danh tính của bạn đã được xác minh."
      actionLabel="Tiếp tục"
    />
  ),
})
