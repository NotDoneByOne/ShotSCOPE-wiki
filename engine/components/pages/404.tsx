import { i18n } from "../../i18n"
import { LANGS, langPrefix, localeOf } from "../../util/lang"
import { joinSegments } from "../../util/path"
import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "../types"

const NotFound: WikiComponent = ({ cfg }: WikiComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>404</h1>
      {LANGS.map((lang) => {
        const t = i18n(localeOf(lang)).pages.error
        return (
          <div lang={lang}>
            <p>{t.notFound}</p>
            <a href={joinSegments(baseDir, langPrefix(lang)) || "/"}>{t.home}</a>
          </div>
        )
      })}
    </article>
  )
}

export default (() => NotFound) satisfies WikiComponentConstructor
