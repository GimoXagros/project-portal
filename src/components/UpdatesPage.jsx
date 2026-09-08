import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import UpdateTimeline from './UpdateTimeline'
import { getLatestProjectUpdate, getProjectChangelog } from '../data/changelogs'
import { projectBrandStyle } from '../utils/projectMeta'

export default function UpdatesPage({ projects, projectId, onHome, onOpenProject }) {
  const project = projectId ? projects.find((item) => item.id === projectId) : null
  if (projectId && !project) return <main className="not-found section-pad" id="main-content"><span>404</span><h1>업데이트 기록을 찾을 수 없습니다.</h1><p>등록되지 않은 프로젝트이거나 주소가 변경된 기록입니다.</p><button className="button primary" type="button" onClick={() => { window.location.hash = '/updates' }}><ArrowLeft size={18} /> 업데이트 목록으로</button></main>

  return <main className="updates-page" id="main-content">
    <header className="updates-hero section-pad">
      <button className="back-button" type="button" onClick={() => onHome('#top')}><ArrowLeft size={18} /> 아카이브 홈</button>
      <h1>{project ? `${project.title} 업데이트` : '프로젝트별 업데이트 기록'}</h1>
      <p>{project ? project.subtitle : '프로젝트를 선택해 최초 공개부터 최신 릴리스까지 확인하세요.'}</p>
      {project && <button className="button ghost" type="button" onClick={() => onOpenProject(project.id)}>프로젝트 상세 <ArrowUpRight size={17} /></button>}
    </header>
    <div className="updates-layout section-pad">
      {project ? <>
        <nav className="update-project-tabs" aria-label="업데이트 프로젝트 선택">{projects.map((item) => <a href={`#/updates/${item.id}`} key={item.id} aria-current={projectId === item.id ? 'page' : undefined}>{item.title}</a>)}</nav>
        <section className="selected-update-project project-branded" style={projectBrandStyle(project)} aria-label={`${project.title} 전체 업데이트`}><UpdateTimeline changelog={getProjectChangelog(project.id)} /></section>
      </> : <section className="update-index" aria-label="업데이트 프로젝트 선택"><div className="update-index-grid">{projects.map((item) => {
        const latest = getLatestProjectUpdate(item.id)
        return <article className="project-branded" style={projectBrandStyle(item)} key={item.id}><time dateTime={latest?.date}>{latest?.date || '—'}</time><h2><a href={`#/updates/${item.id}`}>{item.title} <ArrowUpRight size={17} /></a></h2><span>{latest?.version || '업데이트 없음'}</span><p>{latest?.summary || '아직 기록된 업데이트가 없습니다.'}</p></article>
      })}</div></section>}
    </div>
  </main>
}
