import { WikiTransformerPlugin } from "../types"
import { LANGS, Lang, isLang, langOfSlug } from "../../util/lang"

export const Language: WikiTransformerPlugin = () => ({
  name: "Language",
  markdownPlugins() {
    return [
      () => (_, file) => {
        const where = file.data.relativePath ?? file.path
        const fm = file.data.frontmatter
        const lang = fm?.lang
        if (!isLang(lang)) {
          throw new Error(
            `${where}: frontmatter \`lang\` is missing or invalid (got ${JSON.stringify(lang)}, expected one of ${LANGS.join(", ")})`,
          )
        }
        const expected = langOfSlug(file.data.slug ?? "")
        if (lang !== expected) {
          throw new Error(
            `${where}: frontmatter \`lang: ${lang}\` does not match its folder (expected \`lang: ${expected}\`)`,
          )
        }
        const key = fm?.translationKey
        if (typeof key !== "string" || key.trim() === "") {
          throw new Error(`${where}: frontmatter \`translationKey\` is missing or not a string`)
        }
        file.data.lang = lang
        file.data.translationKey = key
      },
    ]
  },
})

declare module "vfile" {
  interface DataMap {
    lang: Lang
    translationKey: string
  }
}
