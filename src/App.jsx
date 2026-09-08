import { useEffect, useMemo, useRef, useState } from 'react'
import useReveal from './hooks/useReveal'
import './App.css'
import site from './data/site.json'
import projects from './data/projects.json'
import faq from './data/faq.json'
import { getAllLatestUpdates, getProjectChangelog } from './data/changelogs'
import Header from './components/Header'
import Hero from './components/Hero'
import ProjectGrid from './components/ProjectGrid'
import ProjectDetail from './components/ProjectDetail'
import Timeline from './components/Timeline'
import UpdatesPage from './components/UpdatesPage'
import About from './components/About'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function routeFromHash() {
  const hash = window.location.hash
  const decode = (value) => { try { return decodeURIComponent(value) } catch { return '__invalid__' } }
  const projectMatch = hash.match(/^#\/project\/([^/]+)$/)
  if (projectMatch) return { type: 'project', id: decode(projectMatch[1]) }
  const updateMatch = hash.match(/^#\/updates\/([^/]+)$/)
  if (updateMatch) return { type: 'updates-project', id: decode(updateMatch[1]) }
  if (hash === '#/updates') return { type: 'updates' }
  return { type: 'home', anchor: hash || '#top' }
}

function App() {
  const [route, setRoute] = useState(routeFromHash)
  const pageKey = route.type === 'home' ? 'home' : `${route.type}/${route.id || ''}`
  const pageRef = useRef(null)
  const previousPage = useRef(pageKey)
  useReveal(pageRef, pageKey)
  const activeProject = useMemo(() => route.type === 'project' ? projects.find((project) => project.id === route.id) : null, [route])
  const latestUpdates = useMemo(() => getAllLatestUpdates(), [])

  useEffect(() => {
    const syncRoute = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    if (route.type === 'project') document.title = `${activeProject?.title || '프로젝트 없음'} | ${site.name}`
    else if (route.type.startsWith('updates')) document.title = `${route.id ? (projects.find((item) => item.id === route.id)?.title || '프로젝트 없음') + ' · ' : ''}업데이트 기록 | ${site.name}`
    else document.title = `${site.name} | 개인 게임 프로젝트 아카이브`
    const frame = requestAnimationFrame(() => {
      const anchor = route.type === 'home' && ['#top', '#projects', '#about', '#faq', '#updates'].includes(route.anchor) ? document.getElementById(route.anchor.slice(1)) : null
      if (anchor) anchor.scrollIntoView({ behavior: 'instant' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
      if (previousPage.current !== pageKey) {
        const main = document.getElementById('main-content')
        main?.setAttribute('tabindex', '-1')
        main?.focus({ preventScroll: true })
      }
      previousPage.current = pageKey
    })
    return () => cancelAnimationFrame(frame)
  }, [activeProject, route, pageKey])

  const openProject = (id) => { window.location.hash = `/project/${encodeURIComponent(id)}` }
  const openUpdates = (id) => { window.location.hash = `/updates/${encodeURIComponent(id)}` }
  const navigateHome = (anchor = '#projects') => {
    if (window.location.hash === anchor) {
      setRoute(routeFromHash())
      window.setTimeout(() => document.getElementById(anchor.slice(1))?.scrollIntoView(), 0)
    } else window.location.hash = anchor
  }

  let content
  if (route.type === 'project') content = <ProjectDetail project={activeProject} changelog={getProjectChangelog(route.id)} onBack={() => navigateHome('#projects')} onOpenUpdates={openUpdates} />
  else if (route.type === 'updates' || route.type === 'updates-project') content = <UpdatesPage projects={projects} projectId={route.type === 'updates-project' ? route.id : null} onHome={navigateHome} onOpenProject={openProject} />
  else content = <main id="main-content">
    <div className="site-notice" role="status"><strong>{site.notice.label}</strong><p>{site.notice.text}</p></div>
    <Hero site={site} projects={projects} onNavigate={navigateHome} />
    <ProjectGrid projects={projects} onOpen={openProject} />
    <Timeline updates={latestUpdates} projects={projects} />
    <About site={site} />
    <FAQ items={faq} />
  </main>

  return <div className="site-shell">
    <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); const main = document.getElementById('main-content'); main?.setAttribute('tabindex', '-1'); main?.focus(); main?.scrollIntoView() }}>본문으로 건너뛰기</a>
    <Header site={site} routeType={route.type} pageKey={pageKey} onNavigateHome={navigateHome} />
    <div className="page-frame" ref={pageRef} key={pageKey}>{content}</div>
    <Footer site={site} onNavigate={navigateHome} />
  </div>
}

export default App
