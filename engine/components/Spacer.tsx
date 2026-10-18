import { WikiComponentConstructor, WikiComponentProps } from "./types"
import { classNames } from "../util/lang"

function Spacer({ displayClass }: WikiComponentProps) {
  return <div class={classNames(displayClass, "spacer")}></div>
}

export default (() => Spacer) satisfies WikiComponentConstructor
