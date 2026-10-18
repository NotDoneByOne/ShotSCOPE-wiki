import { PageLayout, SharedLayout } from "./engine/cfg"
import * as Component from "./engine/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      ru: {
        "Команда NotDoneByOne": "https://notdonebyone.ru/",
        "Проект ShotSCOPE": "https://shotscope.ru/",
        "NotDoneByOne © 2026 · Все права защищены": "",
      },
      en: {
        "NotDoneByOne team": "https://notdonebyone.ru/",
        "ShotSCOPE project": "https://shotscope.ru/",
        "NotDoneByOne © 2026 · All rights reserved": "",
      },
    },
  }),
}

// Page settings for the right sidebar on desktop: region and language, then the theme toggle.
const pageSettings = () =>
  Component.Flex({
    components: [
      { Component: Component.RegionPicker(), grow: true },
      { Component: Component.Darkmode() },
    ],
    gap: "0.25rem",
  })

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index" && page.fileData.slug !== "en/index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle({ tag: "Wiki" }),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.RegionPicker() },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    pageSettings(),
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle({ tag: "Wiki" }),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.RegionPicker() },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [pageSettings()],
}
