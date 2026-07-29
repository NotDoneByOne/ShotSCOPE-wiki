import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
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
        header: "Inter",
        body: "Inter",
        code: "IBM Plex Mono",
      },
      // Внимание: имена полей означают светлость самого цвета, а не режим.
      // `light` — фон, `dark` — основной текст. Поэтому в lightMode фон
      // светлый и текст тёмный, и наоборот в darkMode.
      colors: {
         lightMode: {
          light: "#FFFFFF",              // --bg-primary
          lightgray: "#F2F2F2",           // --bg-secondary
          gray: "rgba(45, 68, 80, 0.1)", // --border-light
          darkgray: "#2D4450",            // --text-secondary
          dark: "#2D3E50",                // --text-primary
          secondary: "#DA4453",            // --primary
          tertiary: "#3498DB",             // --secondary
          highlight: "rgba(218, 68, 83, 0.15)", // primary with opacity
          textHighlight: "#FFA07A88",       // --tertiary with opacity
        },
        darkMode: {
          light: "#2D3E50",                // --dark-bg-primary
          lightgray: "#1F2B38",            // --dark-bg-secondary
          gray: "rgba(255, 255, 255, 0.1)", // --dark-border
          darkgray: "#CCCCCC",              // --dark-text-secondary
          dark: "#FFFFFF",                   // --dark-text-primary
          secondary: "#DA4453",              // --primary (kept for brand consistency)
          tertiary: "#3498DB",                // --secondary
          highlight: "rgba(218, 68, 83, 0.25)", // primary with opacity for dark mode
          textHighlight: "#FFA07A88",          // --tertiary with opacity
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
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
