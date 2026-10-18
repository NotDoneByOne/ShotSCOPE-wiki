import { Root } from "hast"
import { GlobalConfiguration } from "../../cfg"
import { getDate } from "../../components/Date"
import { escapeHTML } from "../../util/escape"
import { FilePath, FullSlug, SimpleSlug, joinSegments, simplifySlug } from "../../util/path"
import { WikiEmitterPlugin } from "../types"
import { WikiPluginData } from "../vfile"
import { toHtml } from "hast-util-to-html"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import { DEFAULT_LANG, LANGS, Lang, fileLang, langPrefix, localeOf } from "../../util/lang"

export type ContentIndexMap = Map<FullSlug, ContentDetails>
export type ContentDetails = {
  slug: FullSlug
  filePath: FilePath
  title: string
  links: SimpleSlug[]
  tags: string[]
  content: string
  richContent?: string
  date?: Date
  description?: string
}

interface Options {
  enableSiteMap: boolean
  enableRSS: boolean
  rssLimit?: number
  rssFullHtml: boolean
  rssSlug: string
  includeEmptyFiles: boolean
}

const defaultOptions: Options = {
  enableSiteMap: true,
  enableRSS: true,
  rssLimit: 10,
  rssFullHtml: false,
  rssSlug: "index",
  includeEmptyFiles: true,
}

type Translations = Map<FullSlug, Partial<Record<Lang, FullSlug>>>

function generateSiteMap(
  cfg: GlobalConfiguration,
  idx: ContentIndexMap,
  translations: Translations,
): string {
  const base = cfg.baseUrl ?? ""
  const pageUrl = (slug: SimpleSlug) => `https://${joinSegments(base, encodeURI(slug))}`
  const alternates = (slug: FullSlug): string => {
    const versions = translations.get(slug)
    if (!versions || Object.keys(versions).length < 2) return ""
    const link = (hreflang: string, target: FullSlug) =>
      `\n    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${pageUrl(simplifySlug(target))}"/>`
    const langs = LANGS.filter((lang) => versions[lang])
    const xDefault = versions[DEFAULT_LANG] ?? versions[langs[0]]!
    return [...langs.map((lang) => link(lang, versions[lang]!)), link("x-default", xDefault)].join(
      "",
    )
  }
  const createURLEntry = (slug: FullSlug, content: ContentDetails): string => `<url>
    <loc>${pageUrl(simplifySlug(slug))}</loc>
    ${content.date && `<lastmod>${content.date.toISOString()}</lastmod>`}${alternates(slug)}
  </url>`
  const urls = Array.from(idx)
    .map(([slug, content]) => createURLEntry(slug, content))
    .join("")
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`
}

function generateRSSFeed(
  cfg: GlobalConfiguration,
  idx: ContentIndexMap,
  lang: Lang,
  limit?: number,
): string {
  const base = cfg.baseUrl ?? ""
  const t = i18n(localeOf(lang)).pages.rss

  const createURLEntry = (slug: SimpleSlug, content: ContentDetails): string => `<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(base, encodeURI(slug))}</link>
    <guid>https://${joinSegments(base, encodeURI(slug))}</guid>
    <description><![CDATA[ ${content.richContent ?? content.description} ]]></description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`

  const items = Array.from(idx)
    .sort(([_, f1], [__, f2]) => {
      if (f1.date && f2.date) {
        return f2.date.getTime() - f1.date.getTime()
      } else if (f1.date && !f2.date) {
        return -1
      } else if (!f1.date && f2.date) {
        return 1
      }

      return f1.title.localeCompare(f2.title)
    })
    .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
    .slice(0, limit ?? idx.size)
    .join("")

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>https://${lang === DEFAULT_LANG ? base : joinSegments(base, langPrefix(lang))}</link>
      <description>${!!limit ? t.lastFewNotes({ count: limit }) : t.recentNotes} on ${escapeHTML(
        cfg.pageTitle,
      )}</description>
      <generator>ShotSCOPE Wiki</generator>
      ${items}
    </channel>
  </rss>`
}

export const ContentIndex: WikiEmitterPlugin<Partial<Options>> = (opts) => {
  opts = { ...defaultOptions, ...opts }
  return {
    name: "ContentIndex",
    async *emit(ctx, content) {
      const cfg = ctx.cfg.configuration
      const indexes: Record<Lang, ContentIndexMap> = { ru: new Map(), en: new Map() }
      const allPages: ContentIndexMap = new Map()
      const translations: Translations = new Map()
      const byKey = new Map<string, Partial<Record<Lang, FullSlug>>>()
      for (const [tree, file] of content) {
        const slug = file.data.slug!
        const lang = fileLang(file.data)
        const date = getDate(ctx.cfg.configuration, file.data) ?? new Date()
        if (opts?.includeEmptyFiles || (file.data.text && file.data.text !== "")) {
          const details: ContentDetails = {
            slug,
            filePath: file.data.relativePath!,
            title: file.data.frontmatter?.title!,
            links: file.data.links ?? [],
            tags: file.data.frontmatter?.tags ?? [],
            content: file.data.text ?? "",
            richContent: opts?.rssFullHtml
              ? escapeHTML(toHtml(tree as Root, { allowDangerousHtml: true }))
              : undefined,
            date: date,
            description: file.data.description ?? "",
          }
          indexes[lang].set(slug, details)
          allPages.set(slug, details)
          const key = file.data.translationKey
          if (key) {
            const versions = byKey.get(key) ?? {}
            versions[lang] = slug
            byKey.set(key, versions)
            translations.set(slug, versions)
          }
        }
      }

      if (opts?.enableSiteMap) {
        yield write({
          ctx,
          content: generateSiteMap(cfg, allPages, translations),
          slug: "sitemap" as FullSlug,
          ext: ".xml",
        })
      }

      if (opts?.enableRSS) {
        for (const lang of LANGS) {
          yield write({
            ctx,
            content: generateRSSFeed(cfg, indexes[lang], lang, opts.rssLimit),
            slug: `${langPrefix(lang)}${opts?.rssSlug ?? "index"}` as FullSlug,
            ext: ".xml",
          })
        }
      }

      for (const lang of LANGS) {
        const fp = joinSegments(langPrefix(lang), "static", "contentIndex") as FullSlug
        const simplifiedIndex = Object.fromEntries(
          Array.from(indexes[lang]).map(([slug, content]) => {
            // remove description and from content index as nothing downstream
            // actually uses it. we only keep it in the index as we need it
            // for the RSS feed
            delete content.description
            delete content.date
            return [slug, content]
          }),
        )

        yield write({
          ctx,
          content: JSON.stringify(simplifiedIndex),
          slug: fp,
          ext: ".json",
        })
      }
    },
    externalResources: (ctx) => {
      if (opts?.enableRSS) {
        return {
          additionalHead: [
            (pageData: WikiPluginData) => (
              <link
                rel="alternate"
                type="application/rss+xml"
                title="RSS Feed"
                href={`https://${joinSegments(
                  ctx.cfg.configuration.baseUrl ?? "",
                  `${langPrefix(fileLang(pageData))}index.xml`,
                )}`}
              />
            ),
          ],
        }
      }
    },
  }
}
