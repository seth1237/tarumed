'use client'

import { useEffect } from 'react'

export function ScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!nodes.length) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      nodes.forEach((node) => node.classList.add('is-in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const node = entry.target as HTMLElement
          const delay = Number(node.dataset.revealDelay || 0)
          if (delay) {
            window.setTimeout(() => node.classList.add('is-in'), delay)
          } else {
            node.classList.add('is-in')
          }
          observer.unobserve(node)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return null
}
