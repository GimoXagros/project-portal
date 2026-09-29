import { ArrowUpRight } from 'lucide-react'
import ProjectLogo from './ProjectLogo'
import { projectBrandStyle, statusLabels, typeLabels } from '../utils/projectMeta'

export default function ProjectCard({ project, onOpen, featured = false }) {
  return <article className="project-card project-branded" data-project-id={project.id} style={projectBrandStyle(project)}>
    <ProjectLogo project={project} />
    <div className="project-card-body">
      <div className="card-topline">
        <span className="type-label">{typeLabels[project.type] || typeLabels.other}</span>
        {featured && <span className="featured-ribbon">추천</span>}
      </div>
      <h3>{project.title}</h3>
      <div className="project-release-line"><span>{project.version || '버전 미정'}</span><span className={`status-badge status-${project.status}`}>{statusLabels[project.status] || project.status}</span></div>
      {project.prerelease && <div className="project-prerelease-line"><span>시험판 · {project.prerelease.version}</span></div>}
      <p className="project-summary">{project.subtitle || project.description}</p>
      <div className="chip-row" aria-label={`플랫폼: ${(project.platform || []).join(', ')}`} title={(project.platform || []).join(', ')}>{(project.platform || []).slice(0, 2).map((platform) => <span className="chip" key={platform}>{platform}</span>)}{project.platform?.length > 2 && <span className="chip">+{project.platform.length - 2}</span>}</div>
      <div className="card-footer">
        <button type="button" onClick={() => onOpen(project.id)} aria-label={`${project.title} 상세보기`}>상세보기 <ArrowUpRight size={17} /></button>
      </div>
    </div>
  </article>
}
