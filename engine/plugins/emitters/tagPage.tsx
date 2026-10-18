import { WikiEmitterPlugin } from "../types"
import { WikiComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, WikiPluginData, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FullSlug, getAllSegmentPrefixes, joinSegments, pathToRoot } from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../wiki.layout"
import { TagContent } from "../../components"
import { write } from "./helpers"
import { i18n, TRANSLATIONS } from "../../i18n"
import { BuildCtx } from "../../util/ctx"
import { StaticResources } from "../../util/resources"
import { LANGS, Lang, fileLang, langPrefix, localeOf, stripLangPrefix } from "../../util/lang"

interface TagPageOptions extends FullPageLayout {
  sort?: (f1: WikiPluginData, f2: WikiPluginData) => number
}

function computeTagInfo(
  allFiles: WikiPluginData[],
  content: ProcessedContent[],
  locale: keyof typeof TRANSLATIONS,
  lang: Lang,
): [Set<string>, Record<string, ProcessedContent>] {
  const tags: Set<string> = new Set(
    allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
  )

  // add base tag
  tags.add("index")

  const tagDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
    [...tags].map((tag) => {
      const title =
        tag === "index"
          ? i18n(locale).pages.tagContent.tagIndex
          : `${i18n(locale).pages.tagContent.tag}: ${tag}`
      return [
        tag,
        defaultProcessedContent({
          slug: joinSegments(`${langPrefix(lang)}tags`, tag) as FullSlug,
          frontmatter: { title, tags: [] },
        }),
      ]
    }),
  )

  // Update with actual content if available
  for (const [tree, file] of content) {
    const slug = file.data.slug!
    if (stripLangPrefix(slug).startsWith("tags/")) {
      const tag = stripLangPrefix(slug).slice("tags/".length)
      if (tags.has(tag)) {
        tagDescriptions[tag] = [tree, file]
        if (file.data.frontmatter?.title === tag) {
          file.data.frontmatter.title = `${i18n(locale).pages.tagContent.tag}: ${tag}`
        }
      }
    }
  }

  return [tags, tagDescriptions]
}

async function processTagPage(
  ctx: BuildCtx,
  tag: string,
  tagContent: ProcessedContent,
  allFiles: WikiPluginData[],
  opts: FullPageLayout,
  resources: StaticResources,
) {
  const [tree, file] = tagContent
  const slug = joinSegments(`${langPrefix(fileLang(file.data))}tags`, tag) as FullSlug
  const cfg = ctx.cfg.configuration
  const externalResources = pageResources(pathToRoot(slug), resources, fileLang(file.data))
  const componentData: WikiComponentProps = {
    ctx,
    fileData: file.data,
    externalResources,
    cfg,
    children: [],
    tree,
    allFiles,
  }

  const content = renderPage(cfg, slug, componentData, opts, externalResources)
  return write({
    ctx,
    content,
    slug: file.data.slug!,
    ext: ".html",
  })
}

export const TagPage: WikiEmitterPlugin<Partial<TagPageOptions>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: TagContent({ sort: userOpts?.sort }),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "TagPage",
    getWikiComponents() {
      return [
        Head,
        Header,
        Body,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)

      for (const lang of LANGS) {
        const langContent = content.filter((c) => fileLang(c[1].data) === lang)
        const langFiles = langContent.map((c) => c[1].data)
        const [tags, tagDescriptions] = computeTagInfo(langFiles, langContent, localeOf(lang), lang)

        for (const tag of tags) {
          yield processTagPage(ctx, tag, tagDescriptions[tag], allFiles, opts, resources)
        }
      }
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      const allFiles = content.map((c) => c[1].data)

      // Find all tags that need to be updated based on changed files, per language
      const affectedTags: Record<Lang, Set<string>> = { ru: new Set(), en: new Set() }
      for (const changeEvent of changeEvents) {
        if (!changeEvent.file) continue
        const slug = changeEvent.file.data.slug!
        const affected = affectedTags[fileLang(changeEvent.file.data)]

        // If it's a tag page itself that changed
        if (stripLangPrefix(slug).startsWith("tags/")) {
          const tag = stripLangPrefix(slug).slice("tags/".length)
          affected.add(tag)
        }

        // If a file with tags changed, we need to update those tag pages
        const fileTags = changeEvent.file.data.frontmatter?.tags ?? []
        fileTags.flatMap(getAllSegmentPrefixes).forEach((tag) => affected.add(tag))

        // Always update the index tag page if any file changes
        affected.add("index")
      }

      for (const lang of LANGS) {
        if (affectedTags[lang].size === 0) continue
        // We still need to compute all tags because tag pages show all tags
        const langContent = content.filter((c) => fileLang(c[1].data) === lang)
        const langFiles = langContent.map((c) => c[1].data)
        const [_tags, tagDescriptions] = computeTagInfo(
          langFiles,
          langContent,
          localeOf(lang),
          lang,
        )

        for (const tag of affectedTags[lang]) {
          if (tagDescriptions[tag]) {
            yield processTagPage(ctx, tag, tagDescriptions[tag], allFiles, opts, resources)
          }
        }
      }
    },
  }
}
