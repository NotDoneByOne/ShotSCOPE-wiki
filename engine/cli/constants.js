import { readFileSync } from "fs"

/**
 * All constants relating to the build handler
 */
export const cacheFile = "./engine/.wiki-cache/transpiled-build.mjs"
export const fp = "./engine/build.ts"
export const { version } = JSON.parse(readFileSync("./package.json").toString())
