import { PluggableList } from "unified"
import { StaticResources } from "../util/resources"
import { ProcessedContent } from "./vfile"
import { WikiComponent } from "../components/types"
import { FilePath } from "../util/path"
import { BuildCtx } from "../util/ctx"
import { VFile } from "vfile"

export interface PluginTypes {
  transformers: WikiTransformerPluginInstance[]
  filters: WikiFilterPluginInstance[]
  emitters: WikiEmitterPluginInstance[]
}

type OptionType = object | undefined
type ExternalResourcesFn = (ctx: BuildCtx) => Partial<StaticResources> | undefined
export type WikiTransformerPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => WikiTransformerPluginInstance
export type WikiTransformerPluginInstance = {
  name: string
  textTransform?: (ctx: BuildCtx, src: string) => string
  markdownPlugins?: (ctx: BuildCtx) => PluggableList
  htmlPlugins?: (ctx: BuildCtx) => PluggableList
  externalResources?: ExternalResourcesFn
}

export type WikiFilterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => WikiFilterPluginInstance
export type WikiFilterPluginInstance = {
  name: string
  shouldPublish(ctx: BuildCtx, content: ProcessedContent): boolean
}

export type ChangeEvent = {
  type: "add" | "change" | "delete"
  path: FilePath
  file?: VFile
}

export type WikiEmitterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => WikiEmitterPluginInstance
export type WikiEmitterPluginInstance = {
  name: string
  emit: (
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
  ) => Promise<FilePath[]> | AsyncGenerator<FilePath>
  partialEmit?: (
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
    changeEvents: ChangeEvent[],
  ) => Promise<FilePath[]> | AsyncGenerator<FilePath> | null
  /**
   * Returns the components (if any) that are used in rendering the page.
   * This helps the engine optimize the page by only including necessary resources
   * for components that are actually used.
   */
  getWikiComponents?: (ctx: BuildCtx) => WikiComponent[]
  externalResources?: ExternalResourcesFn
}
