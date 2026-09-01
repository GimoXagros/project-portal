import { useEffect, useMemo, useState } from 'react'
import './App.css'
import site from './data/site.json'
import projects from './data/projects.json'
import changelog from './data/changelog.json'
import faq from './data/faq.json'
import Header from './components/Header'
import Hero from './components/Hero'
import FeaturedProjects from './components/FeaturedProjects'
import ProjectGrid from './components/ProjectGrid'
import ProjectDetail from './components/ProjectDetail'
import Timeline from './components/Timeline'
import About from './components/About'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function projectIdFromHash() {
  const match = window.location.hash.match(/^#\/project\/([^/]+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

function App() {
  const [activeProjectId, setActiveProjectId] = useState(projectIdFromHash)
  const activeProject = useMemo(() => projects.find((project) => project.id === activeProjectId), [activeProjectId])

  useEffect(() => {
    const syncRoute = () => setActiveProjectId(projectIdFromHash())
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    document.title = activeProject ? `${activeProject.title} | ${site.name}` : `${site.name} | 개인 게임 프로젝트 아카이브`
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activeProject])

  const openProject = (id) => {
    window.location.hash = `/project/${encodeURIComponent(id)}`
  }

  const navigateHome = (anchor = '#projects') => {
    setActiveProjectId(null)
    if (window.location.hash === anchor) {
      window.setTimeout(() => document.querySelector(anchor)?.scrollIntoView(), 0)
    } else {
      window.location.hash = anchor
    }
  }

  return <div className="site-shell">
    <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
    <Header site={site} onNavigateHome={navigateHome} />
    {activeProjectId ? <ProjectDetail project={activeProject} onBack={() => navigateHome('#projects')} /> : <main id="main-content">
      <div className="site-notice" role="status"><strong>{site.notice.label}</strong><p>{site.notice.text}</p></div>
      <Hero site={site} projects={projects} onNavigate={navigateHome} />
      <FeaturedProjects projects={projects} onOpen={openProject} />
      <ProjectGrid projects={projects} onOpen={openProject} />
      <Timeline items={changelog} />
      <About site={site} />
      <FAQ items={faq} />
    </main>}
    <Footer site={site} onNavigate={navigateHome} />
  </div>
}

export default App
