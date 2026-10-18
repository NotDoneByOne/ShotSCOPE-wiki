import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "./types"

type ConditionalRenderConfig = {
  component: WikiComponent
  condition: (props: WikiComponentProps) => boolean
}

export default ((config: ConditionalRenderConfig) => {
  const ConditionalRender: WikiComponent = (props: WikiComponentProps) => {
    if (config.condition(props)) {
      return <config.component {...props} />
    }

    return null
  }

  ConditionalRender.afterDOMLoaded = config.component.afterDOMLoaded
  ConditionalRender.beforeDOMLoaded = config.component.beforeDOMLoaded
  ConditionalRender.css = config.component.css

  return ConditionalRender
}) satisfies WikiComponentConstructor<ConditionalRenderConfig>
