import { Lang, LANGS, LANG_NAMES, defaultRegion, isLang, regionLang } from "../../util/lang"

const STORAGE_KEY = "region"
const EXCLUDED = new Set(["EU", "EZ", "UN", "QO", "XA", "XB", "ZZ"])
const PINNED = ["RU", "BY", "KZ", "KG"]
const A = 65

interface Region {
  code: string
  name: string
  alt: string
  lang: Lang
  haystack: string
  el?: HTMLLIElement
}

const normalize = (s: string) => s.toLowerCase().replaceAll("ё", "е")

// Deprecated codes (DD, SU, UK, ...) are canonicalized to a different region.
function isCanonical(code: string): boolean {
  try {
    return new Intl.Locale(`und-${code}`).region === code
  } catch {
    return false
  }
}

function loadRegions(pageLang: Lang): Region[] {
  const probe = new Intl.DisplayNames(["en"], { type: "region", fallback: "none" })
  const other = LANGS.find((l) => l !== pageLang) ?? pageLang
  const own = new Intl.DisplayNames([pageLang], { type: "region" })
  const second = new Intl.DisplayNames([other], { type: "region" })
  const result: Region[] = []
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      const code = String.fromCharCode(A + i, A + j)
      if (EXCLUDED.has(code) || !probe.of(code) || !isCanonical(code)) continue
      const name = own.of(code) ?? code
      const alt = second.of(code) ?? code
      result.push({
        code,
        name,
        alt,
        lang: regionLang(code),
        haystack: normalize(`${name} ${alt} ${code}`),
      })
    }
  }
  return result.sort((a, b) => a.name.localeCompare(b.name, pageLang))
}

const SVG_NS = "http://www.w3.org/2000/svg"

function checkIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg")
  svg.setAttribute("class", "region-picker-check")
  svg.setAttribute("viewBox", "0 0 16 16")
  svg.setAttribute("aria-hidden", "true")
  const path = document.createElementNS(SVG_NS, "path")
  path.setAttribute("d", "M3 8.5 6.5 12 13 4.5")
  svg.append(path)
  return svg
}

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStored(code: string) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // storage unavailable: choice is not remembered
  }
}

function currentRegion(pageLang: Lang): string {
  const stored = readStored()
  if (stored && /^[A-Z]{2}$/.test(stored) && regionLang(stored) === pageLang) return stored
  for (const tag of navigator.languages ?? []) {
    try {
      const code = new Intl.Locale(tag).region
      if (code && regionLang(code) === pageLang) return code
    } catch {
      // malformed tag
    }
  }
  return defaultRegion(pageLang)
}

function setup(root: HTMLElement, n: number) {
  const pageLang = isLang(root.dataset.lang) ? root.dataset.lang : "ru"
  const trigger = root.querySelector<HTMLButtonElement>(".region-picker-trigger")
  const container = root.querySelector<HTMLElement>(".region-picker-container")
  const dialog = root.querySelector<HTMLElement>(".region-picker-space")
  const input = root.querySelector<HTMLInputElement>(".region-picker-search")
  const list = root.querySelector<HTMLUListElement>(".region-picker-list")
  const nameEl = root.querySelector<HTMLElement>(".region-picker-name")
  if (!trigger || !container || !dialog || !input || !list || !nameEl) return

  dialog.id = `region-picker-dialog-${n}`
  list.id = `region-picker-list-${n}`
  trigger.setAttribute("aria-controls", dialog.id)
  input.setAttribute("aria-controls", list.id)

  const ownNames = new Intl.DisplayNames([pageLang], { type: "region" })
  const showRegion = (regionCode: string) => {
    nameEl.textContent = ownNames.of(regionCode) ?? regionCode
  }

  let current = currentRegion(pageLang)
  showRegion(current)
  let regions: Region[] | null = null
  let visible: Region[] = []
  let active = -1

  const isOpen = () => root.dataset.open === "true"

  const setActive = (index: number) => {
    active = index
    visible.forEach((r, i) => {
      r.el?.classList.toggle("active", i === index)
      r.el?.setAttribute("aria-selected", String(i === index))
    })
    const el = visible[index]?.el
    if (el) {
      input.setAttribute("aria-activedescendant", el.id)
      el.scrollIntoView({ block: "nearest" })
    } else {
      input.removeAttribute("aria-activedescendant")
    }
  }

  const build = () => {
    regions = loadRegions(pageLang)
    const frag = document.createDocumentFragment()
    for (const r of regions) {
      const li = document.createElement("li")
      li.id = `${list.id}-${r.code}`
      li.setAttribute("role", "option")
      li.dataset.code = r.code
      const name = document.createElement("span")
      name.className = "region-name"
      name.textContent = r.name
      const lang = document.createElement("span")
      lang.className = "region-lang"
      lang.textContent = LANG_NAMES[r.lang]
      li.append(name, lang, checkIcon())
      r.el = li
      frag.append(li)
    }
    const empty = document.createElement("li")
    empty.className = "region-empty"
    empty.setAttribute("role", "presentation")
    empty.textContent = root.dataset.empty ?? ""
    empty.hidden = true
    frag.append(empty)
    list.append(frag)
  }

  const filter = () => {
    if (!regions) return
    const q = normalize(input.value.trim())
    root.dataset.filtering = String(q.length > 0)
    const matches = q ? regions.filter((r) => r.haystack.includes(q)) : [...regions]
    if (q) {
      const rank = (r: Region) => {
        const n = normalize(r.name)
        return n.startsWith(q) ? 0 : n.includes(q) || normalize(r.alt).startsWith(q) ? 1 : 2
      }
      matches.sort((a, b) => rank(a) - rank(b))
    } else {
      const order = [current, ...PINNED.filter((c) => c !== current)]
      const top = order
        .map((c) => matches.find((r) => r.code === c))
        .filter((r): r is Region => r !== undefined)
      const rest = matches.filter((r) => !order.includes(r.code))
      matches.splice(0, matches.length, ...top, ...rest)
    }
    const shown = new Set(matches)
    let anchor: Node | null = null
    for (let i = matches.length - 1; i >= 0; i--) {
      const el = matches[i].el!
      list.insertBefore(el, anchor ?? list.querySelector(".region-empty"))
      anchor = el
    }
    for (const r of regions) {
      r.el!.hidden = !shown.has(r)
      r.el!.classList.toggle("current", r.code === current)
    }
    const emptyEl = list.querySelector<HTMLElement>(".region-empty")
    if (emptyEl) emptyEl.hidden = matches.length > 0
    visible = matches
    list.scrollTop = 0
    setActive(q && matches.length > 0 ? 0 : -1)
  }

  const open = () => {
    if (isOpen()) return
    if (!regions) build()
    input.value = ""
    filter()
    root.dataset.open = "true"
    trigger.setAttribute("aria-expanded", "true")
    input.focus({ preventScroll: true })
  }

  const close = (restoreFocus: boolean) => {
    if (!isOpen()) return
    root.dataset.open = "false"
    trigger.setAttribute("aria-expanded", "false")
    if (restoreFocus) trigger.focus({ preventScroll: true })
  }

  const choose = (region: Region) => {
    writeStored(region.code)
    current = region.code
    showRegion(region.code)
    if (region.lang !== pageLang) {
      const href = root.dataset[region.lang === "ru" ? "hrefRu" : "hrefEn"]
      if (href) {
        location.href = href
        return
      }
    }
    close(true)
  }

  const onTrigger = () => (isOpen() ? close(true) : open())
  const onInput = () => filter()
  const onKey = (e: KeyboardEvent) => {
    if (!isOpen()) return
    if (e.key === "Escape") {
      e.preventDefault()
      e.stopPropagation()
      close(true)
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (visible.length === 0) return
      const step = e.key === "ArrowDown" ? 1 : -1
      setActive((active + step + visible.length) % visible.length)
    } else if (e.key === "Enter" && e.target === input) {
      e.preventDefault()
      const region = visible[active]
      if (region) choose(region)
    }
  }
  const onListClick = (e: MouseEvent) => {
    const li = (e.target as HTMLElement).closest<HTMLLIElement>("li[data-code]")
    const region = regions?.find((r) => r.code === li?.dataset.code)
    if (region) choose(region)
  }
  const onBackdrop = (e: Event) => {
    if (isOpen() && e.target === container) close(true)
  }

  trigger.addEventListener("click", onTrigger)
  input.addEventListener("input", onInput)
  root.addEventListener("keydown", onKey)
  list.addEventListener("click", onListClick)
  container.addEventListener("pointerdown", onBackdrop)
  window.addCleanup(() => {
    trigger.removeEventListener("click", onTrigger)
    input.removeEventListener("input", onInput)
    root.removeEventListener("keydown", onKey)
    list.removeEventListener("click", onListClick)
    container.removeEventListener("pointerdown", onBackdrop)
  })
}

document.addEventListener("nav", () => {
  document.querySelectorAll<HTMLElement>(".region-picker").forEach(setup)
})
