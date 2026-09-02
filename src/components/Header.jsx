import { useEffect, useRef, useState } from 'react'
import { Github, Menu, Moon, Sun, X } from 'lucide-react'

const navigation = [['홈', '#top'], ['프로젝트', '#projects'], ['업데이트', '#/updates'], ['소개', '#about'], ['FAQ', '#faq']]
const themeKey = 'project-portal-theme'
function savedTheme() {
  try { const value = localStorage.getItem(themeKey); return ['light', 'dark'].includes(value) ? value : null } catch { return null }
}

export default function Header({ site, routeType, pageKey, onNavigateHome }) {
  const [theme, setTheme] = useState(() => savedTheme() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const explicitTheme = useRef(Boolean(savedTheme()))
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState('#top')
  const headerRef = useRef(null)
  const menuButton = useRef(null)
  const spyLock = useRef(0)

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const sync = () => { if (!explicitTheme.current) setTheme(media.matches ? 'dark' : 'light') }
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const height = document.documentElement.scrollHeight - window.innerHeight
      headerRef.current?.style.setProperty('--scroll-progress', height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0)
      if (headerRef.current) headerRef.current.dataset.scrolled = String(window.scrollY > 24)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    resize?.observe(document.body)
    schedule()
    return () => { cancelAnimationFrame(frame); resize?.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [pageKey])

  useEffect(() => {
    if (routeType !== 'home' || !window.IntersectionObserver) return undefined
    const sections = ['top', 'projects', 'about', 'faq'].map((id) => document.getElementById(id)).filter(Boolean)
    const update = () => {
      if (performance.now() < spyLock.current) return
      const current = sections.filter((node) => node.getBoundingClientRect().top <= window.innerHeight * .3).at(-1)
      setSection('#' + (current?.id || 'top'))
    }
    let observer
    try {
      observer = new IntersectionObserver(update, { rootMargin: '-70px 0px -70% 0px' })
      sections.forEach((node) => observer.observe(node))
    } catch {
      observer?.disconnect()
      return undefined
    }
    const settle = () => { spyLock.current = 0; update() }
    window.addEventListener('scrollend', settle)
    update()
    return () => { observer.disconnect(); window.removeEventListener('scrollend', settle) }
  }, [routeType, pageKey])

  useEffect(() => {
    const close = (returnFocus = false) => { setOpen(false); if (returnFocus) menuButton.current?.focus() }
    const keydown = (event) => { if (event.key === 'Escape' && open) close(true) }
    const outside = (event) => { if (open && !headerRef.current?.contains(event.target)) close(headerRef.current?.querySelector('.mobile-nav')?.contains(document.activeElement)) }
    const routeChanged = () => close(false)
    const resized = () => { if (window.innerWidth > 1024) close(false) }
    document.addEventListener('keydown', keydown)
    document.addEventListener('pointerdown', outside)
    window.addEventListener('hashchange', routeChanged)
    window.addEventListener('resize', resized)
    return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('pointerdown', outside); window.removeEventListener('hashchange', routeChanged); window.removeEventListener('resize', resized) }
  }, [open])

  const follow = (href) => {
    if (open) menuButton.current?.focus()
    setOpen(false)
    if (!href.startsWith('#/')) { spyLock.current = performance.now() + 500; setSection(href) }
    onNavigateHome(href)
  }
  const current = (href) => href === '#/updates' ? (routeType.startsWith('updates') ? 'page' : undefined) : (routeType === 'home' && section === href ? 'location' : undefined)
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    explicitTheme.current = true
    setTheme(next)
    try { localStorage.setItem(themeKey, next) } catch { /* Session-only choice when storage is unavailable. */ }
  }

  return <header className="topbar" ref={headerRef}>
    <button className="brand brand-button" type="button" onClick={() => follow('#top')} aria-label={site.name + ' 홈'}>
      <span aria-hidden="true">{site.shortName}</span><strong>{site.name}</strong><small aria-hidden="true">ARCHIVE NOTE</small>
    </button>
    <nav className="desktop-nav" aria-label="주요 메뉴">
      {navigation.map(([label, href]) => <button type="button" className={current(href) ? 'active' : ''} aria-current={current(href)} key={href} onClick={() => follow(href)}>{label}</button>)}
      {site.githubUrl && <a href={site.githubUrl} target="_blank" rel="noreferrer"><Github size={16} aria-hidden="true" /> GitHub</a>}
    </nav>
    <div className="header-actions">
      <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? '라이트 테마로 변경' : '다크 테마로 변경'}>
        <span key={theme} aria-hidden="true">{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</span>
      </button>
      <button ref={menuButton} className="icon-button menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? '메뉴 닫기' : '메뉴 열기'}>
        {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>
    </div>
    <nav className="mobile-nav" data-open={open} inert={!open} aria-hidden={!open} id="mobile-menu" aria-label="모바일 메뉴">
      {navigation.map(([label, href]) => <button type="button" aria-current={current(href)} key={href} onClick={() => follow(href)}>{label}<span aria-hidden="true">↘</span></button>)}
      {site.githubUrl && <a href={site.githubUrl} target="_blank" rel="noreferrer" onClick={() => { setOpen(false); menuButton.current?.focus() }}>GitHub <span aria-hidden="true">↗</span></a>}
    </nav>
    <div className="scroll-progress" aria-hidden="true" />
  </header>
}
