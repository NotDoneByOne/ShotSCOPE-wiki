import type { ValidLocale } from "../i18n"
import type { WikiPluginData } from "../plugins/vfile"
import type { FullSlug } from "./path"

export function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

export function classNames(
  displayClass?: "mobile-only" | "desktop-only",
  ...classes: string[]
): string {
  if (displayClass) {
    classes.push(displayClass)
  }
  return classes.join(" ")
}

export const LANGS = ["ru", "en"] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = "ru"

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value)
}

export function langOfSlug(slug: string): Lang {
  return slug === "en" || slug.startsWith("en/") ? "en" : "ru"
}

export function langPrefix(lang: Lang): string {
  return lang === "en" ? "en/" : ""
}

export function langHomeSlug(lang: Lang): FullSlug {
  return `${langPrefix(lang)}index` as FullSlug
}

export function localeOf(lang: Lang): ValidLocale {
  return lang === "en" ? "en-US" : "ru-RU"
}

export function fileLang(data: Partial<WikiPluginData>): Lang {
  return data.lang ?? langOfSlug(data.slug ?? "")
}

export function stripLangPrefix(slug: string): string {
  if (slug === "en") return ""
  return slug.startsWith("en/") ? slug.slice("en/".length) : slug
}

export function pageLocale(data: Partial<WikiPluginData>): ValidLocale {
  return localeOf(fileLang(data))
}

export function translationsOf(
  data: Partial<WikiPluginData>,
  allFiles: Partial<WikiPluginData>[],
): Partial<Record<Lang, FullSlug>> {
  const result: Partial<Record<Lang, FullSlug>> = {}
  const key = data.translationKey
  if (!key) return result
  for (const file of allFiles) {
    if (file.translationKey === key && file.slug) {
      result[fileLang(file)] ??= file.slug
    }
  }
  return result
}

export const LANG_NAMES: Record<Lang, string> = { ru: "Русский", en: "English" }

const RU_REGIONS = ["RU", "BY", "KZ", "KG"]

export function regionLang(code: string): Lang {
  return RU_REGIONS.includes(code.toUpperCase()) ? "ru" : "en"
}

export function defaultRegion(lang: Lang): string {
  return lang === "ru" ? "RU" : "US"
}
