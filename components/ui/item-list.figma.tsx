import figma from "@figma/code-connect"
import { ItemList, ItemListItem } from "./item-list"

figma.connect(ItemList, "https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs?node-id=5120:11342", {
  example: () => (
    <ItemList>
      <ItemListItem
        label="Title"
        sublabel="Description"
        metadata="Value"
        showChevron
        divider
      />
    </ItemList>
  ),
})
