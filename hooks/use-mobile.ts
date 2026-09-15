import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // window.matchMedia() is the modern CSSOM media-query API, but it isn't available on every
    // browser/runtime yet. Degrade to the classic resize listener when it is missing so the hook
    // never crashes and still re-measures on viewport changes.
    let mql: ReturnType<typeof window.matchMedia> | null = null
    try {
      if (typeof window.matchMedia === "function") {
        mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      }
    } catch {
      mql = null
    }

    mql?.addEventListener("change", onChange)
    window.addEventListener("resize", onChange)
    onChange()

    return () => {
      mql?.removeEventListener("change", onChange)
      window.removeEventListener("resize", onChange)
    }
  }, [])

  return isMobile
}
