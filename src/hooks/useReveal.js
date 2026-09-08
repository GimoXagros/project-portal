import { useEffect } from 'react'

const targets = '.section-heading,.project-card,.update-feed > li,.project-update-timeline > li,.principle-grid > article,.legal-panel,.faq-list > details,.detail-hero,.detail-section,.detail-aside > *,.update-project-tabs > a,.update-index-grid > article,.info-block'

// No pending/hidden state. Only intersecting elements receive a finite animation.
export default function useReveal(rootRef, pageKey) {
  useEffect(() => {
    const root = rootRef.current
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!root || !window.IntersectionObserver || media.matches) return undefined
    const seen = new WeakSet()
    const timers = new Set()
    let observer, mutations
    const reset = () => {
      observer?.disconnect()
      mutations?.disconnect()
      timers.forEach(clearTimeout)
      root.classList.remove('motion-ready')
      root.querySelectorAll('.reveal-enter').forEach((node) => node.classList.remove('reveal-enter'))
    }
    const observe = (node) => {
      if (!(node instanceof Element)) return
      const candidates = [...(node.matches(targets) ? [node] : []), ...node.querySelectorAll(targets)]
      candidates.forEach((element) => { if (!seen.has(element)) { seen.add(element); observer.observe(element) } })
    }
    try {
      observer = new IntersectionObserver((entries) => {
        try {
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return
            observer.unobserve(target)
            if (media.matches) return
            const index = [...target.parentElement.children].indexOf(target)
            target.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`)
            target.classList.add('reveal-enter')
            const timer = setTimeout(() => { target.classList.remove('reveal-enter'); timers.delete(timer) }, 1100)
            timers.add(timer)
          })
        } catch { reset() }
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
      root.classList.add('motion-ready')
      observe(root)
      mutations = new MutationObserver((records) => { try { records.forEach((record) => record.addedNodes.forEach(observe)) } catch { reset() } })
      mutations.observe(root, { childList: true, subtree: true })
      media.addEventListener('change', reset)
    } catch { reset() }
    return () => { reset(); media.removeEventListener('change', reset) }
  }, [rootRef, pageKey])
}
