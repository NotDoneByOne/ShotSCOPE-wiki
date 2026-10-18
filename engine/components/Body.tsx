// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
import clipboardStyle from "./styles/clipboard.scss"
import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "./types"

const Body: WikiComponent = ({ children }: WikiComponentProps) => {
  return <div id="wiki-body">{children}</div>
}

Body.afterDOMLoaded = clipboardScript
Body.css = clipboardStyle

export default (() => Body) satisfies WikiComponentConstructor
