import test, { describe } from "node:test"
import assert from "node:assert"
import * as lang from "./lang"
import type { FullSlug } from "./path"

describe("lang", () => {
  test("isLang", () => {
    assert(lang.isLang("ru"))
    assert(lang.isLang("en"))
    assert(!lang.isLang("de"))
    assert(!lang.isLang(undefined))
  })

  test("langOfSlug", () => {
    assert.strictEqual(lang.langOfSlug("en"), "en")
    assert.strictEqual(lang.langOfSlug("en/index"), "en")
    assert.strictEqual(lang.langOfSlug("en/ShotSCOPE/FAQ"), "en")
    assert.strictEqual(lang.langOfSlug("index"), "ru")
    assert.strictEqual(lang.langOfSlug("ShotSCOPE/FAQ"), "ru")
    assert.strictEqual(lang.langOfSlug("english/page"), "ru")
  })

  test("langPrefix and langHomeSlug", () => {
    assert.strictEqual(lang.langPrefix("ru"), "")
    assert.strictEqual(lang.langPrefix("en"), "en/")
    assert.strictEqual(lang.langHomeSlug("ru"), "index")
    assert.strictEqual(lang.langHomeSlug("en"), "en/index")
  })

  test("localeOf", () => {
    assert.strictEqual(lang.localeOf("ru"), "ru-RU")
    assert.strictEqual(lang.localeOf("en"), "en-US")
  })

  test("fileLang", () => {
    assert.strictEqual(lang.fileLang({ lang: "en", slug: "index" as any }), "en")
    assert.strictEqual(lang.fileLang({ slug: "en/a" as any }), "en")
    assert.strictEqual(lang.fileLang({ slug: "a" as any }), "ru")
    assert.strictEqual(lang.fileLang({}), "ru")
  })

  test("stripLangPrefix", () => {
    assert.strictEqual(lang.stripLangPrefix("en/a/b"), "a/b")
    assert.strictEqual(lang.stripLangPrefix("en"), "")
    assert.strictEqual(lang.stripLangPrefix("a/b"), "a/b")
    assert.strictEqual(lang.stripLangPrefix("english"), "english")
  })

  test("pageLocale", () => {
    assert.strictEqual(lang.pageLocale({ slug: "en/a" as FullSlug }), "en-US")
    assert.strictEqual(lang.pageLocale({ slug: "a" as FullSlug }), "ru-RU")
    assert.strictEqual(lang.pageLocale({ lang: "en" }), "en-US")
  })

  test("translationsOf", () => {
    const ru = { slug: "a/b" as FullSlug, lang: "ru" as const, translationKey: "k" }
    const en = { slug: "en/a/b" as FullSlug, lang: "en" as const, translationKey: "k" }
    const other = { slug: "c" as FullSlug, lang: "ru" as const, translationKey: "x" }
    assert.deepStrictEqual(lang.translationsOf(ru, [ru, en, other]), { ru: "a/b", en: "en/a/b" })
    assert.deepStrictEqual(lang.translationsOf(other, [ru, en, other]), { ru: "c" })
    assert.deepStrictEqual(lang.translationsOf({ slug: "z" as FullSlug }, [ru, en]), {})
  })

  test("regionLang", () => {
    for (const code of ["RU", "BY", "KZ", "KG", "ru"])
      assert.strictEqual(lang.regionLang(code), "ru")
    for (const code of ["US", "DE", "GB", "UA"]) assert.strictEqual(lang.regionLang(code), "en")
  })

  test("defaultRegion and LANG_NAMES", () => {
    assert.strictEqual(lang.defaultRegion("ru"), "RU")
    assert.strictEqual(lang.defaultRegion("en"), "US")
    assert.strictEqual(lang.LANG_NAMES.ru, "Русский")
    assert.strictEqual(lang.LANG_NAMES.en, "English")
  })
})
