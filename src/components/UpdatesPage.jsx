import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import ProjectLogo from './ProjectLogo'
import UpdateTimeline from './UpdateTimeline'
import { getLatestProjectUpdate, getProjectChangelog } from '../data/changelogs'
import { projectBrandStyle } from '../utils/projectMeta'

export default function UpdatesPage({ projects, projectId, onHome, onOpenProject }) {
  const project = projectId ? projects.find((item) => item.id === projectId) : null

  if (projectId && !project) return <main className="not-found section-pad" id="main-content"><span>404</span><h1>업데이트 기록을 찾을 수 없습니다.</h1><p>등록되지 않은 프로젝트이거나 주소가 변경된 기록입니다.</p><button className="button primary" type="button" onClick={() => { window.location.hash = '/updates' }}><ArrowLeft size={18} /> 업데이트 목록으로</button></main>

  return <main className="updates-page" id="main-content">
    <header className="updates-hero section-pad">
      <button className="back-button" type="button" onClick={() => onHome('#top')}><ArrowLeft size={18} /> 아카이브 홈</button>
      <p className="kicker">PROJECT-BY-PROJECT CHANGELOG</p>
      <h1>{project ? `${project.title} 업데이트` : '프로젝트별 업데이트 기록'}</h1>
      <p>{project ? '이 프로젝트의 확인된 릴리스와 변경 사항만 모아 표시합니다.' : '각 프로젝트의 기록장을 선택하면 독립된 주소에서 변경 이력을 확인할 수 있습니다.'}</p>
    </header>

    <div className="updates-layout section-pad">
      <nav className="update-project-tabs" aria-label="업데이트 프로젝트 선택">
        {projects.map((item) => {
          const latest = getLatestProjectUpdate(item.id)
          return <a className={projectId === item.id ? 'active project-branded' : 'project-branded'} style={projectBrandStyle(item)} href={`#/updates/${item.id}`} key={item.id} aria-current={projectId === item.id ? 'page' : undefined}>
            <ProjectLogo project={item} context="tab" /><span><strong>{item.title}</strong><small>{latest ? `${latest.version} · ${latest.date}` : '업데이트 없음'}</small></span><ArrowUpRight size={16} />
          </a>
        })}
      </nav>

      {project ? <section className="selected-update-project project-branded" style={projectBrandStyle(project)} aria-labelledby="selected-update-title">
        <div className="selected-update-cover"><ProjectLogo project={project} context="detail" /><div><span>PROJECT NOTE</span><h2 id="selected-update-title">{project.title}</h2><p>{project.subtitle}</p><button className="button ghost" type="button" onClick={() => onOpenProject(project.id)}>프로젝트 상세 <ArrowUpRight size={17} /></button></div></div>
        <UpdateTimeline changelog={getProjectChangelog(project.id)} />
      </section> : <section className="update-index" aria-labelledby="update-index-title"><h2 id="update-index-title">기록장을 선택하세요</h2><p>위 카드에서 프로젝트를 선택하면 최신 릴리스부터 해당 프로젝트의 기록만 표시됩니다.</p><div className="update-index-grid">{projects.map((item) => {
        const latest = getLatestProjectUpdate(item.id)
        return <article className="project-branded" style={projectBrandStyle(item)} key={item.id}><span>{latest?.date || '—'}</span><h3>{item.title}</h3><code>{latest?.version || '업데이트 없음'}</code><p>{latest?.summary || '아직 기록된 업데이트가 없습니다.'}</p><a href={`#/updates/${item.id}`}>기록 열기 <ArrowUpRight size={15} /></a></article>
      })}</div></section>}
    </div>
  </main>
}
