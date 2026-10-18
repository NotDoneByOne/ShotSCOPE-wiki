import { WikiComponent, WikiComponentConstructor, WikiComponentProps } from "./types"

export default ((component: WikiComponent) => {
  const Component = component
  const MobileOnly: WikiComponent = (props: WikiComponentProps) => {
    return <Component displayClass="mobile-only" {...props} />
  }

  MobileOnly.displayName = component.displayName
  MobileOnly.afterDOMLoaded = component?.afterDOMLoaded
  MobileOnly.beforeDOMLoaded = component?.beforeDOMLoaded
  MobileOnly.css = component?.css
  return MobileOnly
}) satisfies WikiComponentConstructor<WikiComponent>
