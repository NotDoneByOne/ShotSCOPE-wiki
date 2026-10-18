import { WikiTransformerPlugin } from "../types"
import remarkBreaks from "remark-breaks"

export const HardLineBreaks: WikiTransformerPlugin = () => {
  return {
    name: "HardLineBreaks",
    markdownPlugins() {
      return [remarkBreaks]
    },
  }
}
