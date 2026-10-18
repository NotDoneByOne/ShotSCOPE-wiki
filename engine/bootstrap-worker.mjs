#!/usr/bin/env node
import workerpool from "workerpool"
const cacheFile = "./.wiki-cache/transpiled-worker.mjs"
const { parseMarkdown, processHtml } = await import(cacheFile)
workerpool.worker({
  parseMarkdown,
  processHtml,
})
