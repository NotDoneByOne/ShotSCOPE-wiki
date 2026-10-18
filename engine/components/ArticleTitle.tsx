import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: WikiComponent = ({ fileData, displayClass }: WikiComponentProps) => {
  const title = fileData.frontmatter?.title
  if (title) {
    return <h1 class={classNames(displayClass, "article-title")}>{title}</h1>
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies WikiComponentConstructor
