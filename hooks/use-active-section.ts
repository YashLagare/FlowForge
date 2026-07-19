import { useState, useEffect } from "react"

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>("")
  const sectionIdsString = sectionIds.join(",")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { 
        // Trigger when the element crosses the middle 40% of the screen
        rootMargin: "-30% 0px -30% 0px"
      }
    )

    const ids = sectionIdsString.split(",")
    
    // Slight delay to ensure DOM is fully rendered if used in Next.js
    const timeoutId = setTimeout(() => {
      ids.forEach((id) => {
        if (!id) return
        const element = document.getElementById(id)
        if (element) {
          observer.observe(element)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [sectionIdsString])

  return activeSection
}
