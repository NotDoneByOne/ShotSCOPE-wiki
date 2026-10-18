import { ComponentType, JSX } from "preact"
import { StaticResources, StringResource } from "../util/resources"
import { WikiPluginData } from "../plugins/vfile"
import { GlobalConfiguration } from "../cfg"
import { Node } from "hast"
import { BuildCtx } from "../util/ctx"

export type WikiComponentProps = {
  ctx: BuildCtx
  externalResources: StaticResources
  fileData: WikiPluginData
  cfg: GlobalConfiguration
  children: (WikiComponent | JSX.Element)[]
  tree: Node
  allFiles: WikiPluginData[]
  displayClass?: "mobile-only" | "desktop-only"
} & JSX.IntrinsicAttributes & {
    [key: string]: any
  }

export type WikiComponent = ComponentType<WikiComponentProps> & {
  css?: StringResource
  beforeDOMLoaded?: StringResource
  afterDOMLoaded?: StringResource
}

export type WikiComponentConstructor<Options extends object | undefined = undefined> = (
  opts: Options,
) => WikiComponent
