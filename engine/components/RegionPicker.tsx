import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "./types"
import style from "./styles/regionPicker.scss"
// @ts-ignore
import script from "./scripts/regionPicker.inline"
import { FullSlug, resolveRelative } from "../util/path"
import { i18n } from "../i18n"
import {
  LANGS,
  LANG_NAMES,
  Lang,
  classNames,
  defaultRegion,
  fileLang,
  langHomeSlug,
  langPrefix,
  pageLocale,
  stripLangPrefix,
  translationsOf,
} from "../util/lang"

function targetSlug(
  lang: Lang,
  current: FullSlug,
  translations: Partial<Record<Lang, FullSlug>>,
): FullSlug {
  const translated = translations[lang]
  if (translated) return translated
  const bare = stripLangPrefix(current)
  if (bare === "tags" || bare.startsWith("tags/")) {
    return `${langPrefix(lang)}tags/index` as FullSlug
  }
  return langHomeSlug(lang)
}

function regionName(code: string, lang: Lang): string {
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(code) ?? code
  } catch {
    return code
  }
}

const GlobeIcon = () => (
  <svg class="region-picker-icon" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8" />
    <path d="M2 10h16M10 2c2.2 2.3 3.3 5 3.3 8s-1.1 5.7-3.3 8c-2.2-2.3-3.3-5-3.3-8S7.8 4.3 10 2Z" />
  </svg>
)

const CheckIcon = () => (
  <svg class="region-picker-check" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8.5 6.5 12 13 4.5" />
  </svg>
)

const RegionPicker: WikiComponent = ({ fileData, allFiles, displayClass }: WikiComponentProps) => {
  const current = fileLang(fileData)
  const slug = fileData.slug!
  const translations = translationsOf(fileData, allFiles)
  const t = i18n(pageLocale(fileData)).components.regionPicker
  const region = defaultRegion(current)
  const hrefs = Object.fromEntries(
    LANGS.map((lang) => [
      `data-href-${lang}`,
      resolveRelative(slug, targetSlug(lang, slug, translations)),
    ]),
  )

  return (
    <div
      class={classNames(displayClass, "region-picker")}
      data-lang={current}
      data-default-region={region}
      data-empty={t.empty}
      {...hrefs}
    >
      <button
        type="button"
        class="region-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="region-picker-dialog"
        aria-label={t.label}
        title={t.label}
      >
        <GlobeIcon />
        <span class="region-picker-name">{regionName(region, current)}</span>
        <span class="region-picker-lang">{LANG_NAMES[current]}</span>
      </button>
      <div class="region-picker-container">
        <div
          id="region-picker-dialog"
          class="region-picker-space"
          role="dialog"
          aria-modal="true"
          aria-label={t.label}
        >
          <input
            type="search"
            class="region-picker-search"
            role="combobox"
            autocomplete="off"
            spellcheck={false}
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="region-picker-list"
            aria-label={t.search}
            placeholder={t.search}
          />
          <div class="region-picker-card">
            <p class="region-picker-group region-picker-group-langs">{t.languages}</p>
            <ul class="region-picker-langs">
              {LANGS.map((lang) => (
                <li>
                  <a
                    href={hrefs[`data-href-${lang}`]}
                    lang={lang}
                    hreflang={lang}
                    class={lang === current ? "current" : ""}
                    aria-current={lang === current ? "page" : undefined}
                    data-router-ignore
                  >
                    <span class="region-name">{LANG_NAMES[lang]}</span>
                    {lang === current && <CheckIcon />}
                  </a>
                </li>
              ))}
            </ul>
            <p class="region-picker-group region-picker-group-regions">{t.regions}</p>
            <ul
              id="region-picker-list"
              class="region-picker-list"
              role="listbox"
              aria-label={t.regions}
            ></ul>
          </div>
        </div>
      </div>
    </div>
  )
}

RegionPicker.css = style
RegionPicker.afterDOMLoaded = script

export default (() => RegionPicker) satisfies WikiComponentConstructor
