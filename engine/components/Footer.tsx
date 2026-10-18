import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "./types"
import style from "./styles/footer.scss"
import { DEFAULT_LANG, Lang, fileLang } from "../util/lang"

interface Options {
  links: Partial<Record<Lang, Record<string, string>>>
}

export default ((opts?: Options) => {
  const Footer: WikiComponent = ({ displayClass, fileData }: WikiComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links?.[fileLang(fileData)] ?? opts?.links?.[DEFAULT_LANG] ?? {}
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>© {year}</p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <a href={link}>{text}</a>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies WikiComponentConstructor
