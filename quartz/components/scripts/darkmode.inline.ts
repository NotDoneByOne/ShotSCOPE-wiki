const STORAGE_KEY = "theme"

type Theme = "light" | "dark"

const systemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"

// Явный выбор пользователя. Пока его нет, сайт следует системной теме.
// Значение валидируется: посторонняя строка в localStorage не должна
// попасть в атрибут `saved-theme`.
const savedTheme = (): Theme | null => {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === "light" || value === "dark" ? value : null
}

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute("saved-theme", theme)
}

applyTheme(savedTheme() ?? systemTheme())

const emitThemeChangeEvent = (theme: Theme) => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const switchTheme = () => {
    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    applyTheme(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const themeChange = (e: MediaQueryListEvent) => {
    // Явный выбор пользователя важнее системной темы. Раньше здесь
    // безусловно писался localStorage, поэтому первое же системное
    // переключение создавало «выбор», и сайт навсегда перестал следовать
    // системе.
    if (savedTheme() !== null) {
      return
    }
    const newTheme = e.matches ? "dark" : "light"
    applyTheme(newTheme)
    emitThemeChangeEvent(newTheme)
  }

  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    darkmodeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", switchTheme))
  }

  // Listen for changes in prefers-color-scheme
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
})
