import { SimpleSlug, pathToRoot, resolveRelative } from "../util/path"
import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "./types"
import { classNames, fileLang, pageLocale } from "../util/lang"
import { i18n } from "../i18n"

interface Options {
  tag?: string
}

export default ((opts?: Options) => {
  const PageTitle: WikiComponent = ({ fileData, cfg, displayClass }: WikiComponentProps) => {
    const title = cfg?.pageTitle ?? i18n(pageLocale(fileData)).propertyDefaults.title
    const homeHref =
      fileLang(fileData) === "en"
        ? resolveRelative(fileData.slug!, "en/" as SimpleSlug)
        : pathToRoot(fileData.slug!)
    return (
      <h2 class={classNames(displayClass, "page-title")}>
        <a href={homeHref}>
          {title}
          {opts?.tag && <span class="page-title-tag">{opts.tag}</span>}
        </a>
      </h2>
    )
  }

  PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
`

  return PageTitle
}) satisfies WikiComponentConstructor
