import { useState, useEffect } from "react"

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>("")
  const sectionIdsString = sectionIds.join(",")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the intersection entry with the highest intersection ratio
        // or just the first one that is intersecting
        let currentActiveId = ""
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentActiveId = entry.target.id
          }
        })
        
        if (currentActiveId) {
          setActiveSection(currentActiveId)
        }
      },
      { 
        // Trigger when section hits the top 1/3rd of the viewport
        rootMargin: "-20% 0px -60% 0px" 
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
