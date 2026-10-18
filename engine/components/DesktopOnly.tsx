import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "./types"

export default ((component: WikiComponent) => {
  const Component = component
  const DesktopOnly: WikiComponent = (props: WikiComponentProps) => {
    return <Component displayClass="desktop-only" {...props} />
  }

  DesktopOnly.displayName = component.displayName
  DesktopOnly.afterDOMLoaded = component?.afterDOMLoaded
  DesktopOnly.beforeDOMLoaded = component?.beforeDOMLoaded
  DesktopOnly.css = component?.css
  return DesktopOnly
}) satisfies WikiComponentConstructor<WikiComponent>
