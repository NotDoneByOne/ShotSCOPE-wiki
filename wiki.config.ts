import { WikiConfig } from "./engine/cfg"
import * as Plugin from "./engine/plugins"

/**
 * ShotSCOPE Wiki configuration
 */
const config: WikiConfig = {
  configuration: {
    pageTitle: "ShotSCOPE",
    pageTitleSuffix: " · ShotSCOPE Wiki",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "ru-RU",
    baseUrl: "shotscope.ru",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: { name: "Unbounded", weights: [600], includeItalic: false },
        body: { name: "Onest", weights: [400, 500, 600, 700], includeItalic: false },
        code: { name: "JetBrains Mono", weights: [400, 500], includeItalic: false },
      },
      // Внимание: имена полей означают светлость самого цвета, а не режим.
      // `light` — фон, `dark` — основной текст. Поэтому в lightMode фон
      // светлый и текст тёмный, и наоборот в darkMode.
      // Палитра — ShotSCOPE Optic: secondary = pulse (ссылки), tertiary = lens (акцент).
      colors: {
        lightMode: {
          light: "#F6F8FA", // depth-2: фон чтения светлее страницы, контраст выше
          lightgray: "#E9EEF3", // depth: подложки
          gray: "rgba(12, 27, 40, 0.18)", // line-2
          darkgray: "#465A6B", // ink-2
          dark: "#0C1B28", // ink
          secondary: "#2557D6", // pulse
          tertiary: "#0A766B", // lens
          highlight: "rgba(10, 118, 107, 0.12)", // lens-soft
          textHighlight: "#D98A0B40", // ten, 25%
        },
        darkMode: {
          light: "#07111B", // depth
          lightgray: "#0B1824", // depth-2
          gray: "rgba(232, 241, 246, 0.17)", // line-2
          darkgray: "#9FB3C3", // ink-2
          dark: "#E8F1F6", // ink
          secondary: "#6E98FF", // pulse
          tertiary: "#3DD6C1", // lens
          highlight: "rgba(61, 214, 193, 0.13)", // lens-soft
          textHighlight: "#FFBE5540", // ten, 25%
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.Language(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
