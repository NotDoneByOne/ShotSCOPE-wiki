import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "../types"

const Content: WikiComponent = ({ fileData, tree }: WikiComponentProps) => {
  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

export default (() => Content) satisfies WikiComponentConstructor
