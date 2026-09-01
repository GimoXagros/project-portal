import { useEffect, useState } from 'react'
import { Github, Menu, Moon, Sun, X } from 'lucide-react'

const navigation = [
  ['홈', '#top', 'home'],
  ['프로젝트', '#projects', 'home'],
  ['업데이트', '#/updates', 'updates'],
  ['소개', '#about', 'home'],
  ['FAQ', '#faq', 'home'],
]

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('project-portal-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage can be unavailable in restrictive browser modes.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function Header({ site, routeType, onNavigateHome }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('project-portal-theme', theme)
    } catch {
      // The theme still works for the current session without persistence.
    }
  }, [theme])

  const follow = (href) => {
    setOpen(false)
    onNavigateHome(href)
  }

  return (
    <header className="topbar">
      <button className="brand brand-button" type="button" onClick={() => follow('#top')} aria-label={`${site.name} 홈`}>
        <span aria-hidden="true">{site.shortName}</span>
        <strong>{site.name}</strong><small aria-hidden="true">ARCHIVE NOTE</small>
      </button>
      <nav className="desktop-nav" aria-label="주요 메뉴">
        {navigation.map(([label, href, section]) => <button type="button" className={section === 'updates' ? routeType.startsWith('updates') ? 'active' : '' : routeType === 'home' && href === '#top' ? 'active' : ''} aria-current={section === 'updates' && routeType.startsWith('updates') ? 'page' : undefined} key={href} onClick={() => follow(href)}>{label}</button>)}
        {site.githubUrl ? <a href={site.githubUrl} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a> : <span className="disabled-link" title="site.json에서 GitHub 주소를 설정하세요"><Github size={16} /> GitHub</span>}
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? '라이트 테마로 변경' : '다크 테마로 변경'}>
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button className="icon-button menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? '메뉴 닫기' : '메뉴 열기'}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && <nav className="mobile-nav" id="mobile-menu" aria-label="모바일 메뉴">
        {navigation.map(([label, href]) => <button type="button" key={href} onClick={() => follow(href)}>{label}<span aria-hidden="true">↘</span></button>)}
        {site.githubUrl ? <a href={site.githubUrl} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a> : <span className="disabled-link">GitHub 연결 전</span>}
      </nav>}
    </header>
  )
}
