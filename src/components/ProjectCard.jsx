import { ArrowUpRight } from 'lucide-react'
import ProjectLogo from './ProjectLogo'
import { projectBrandStyle, statusLabels, typeLabels } from '../utils/projectMeta'

export default function ProjectCard({ project, onOpen, featured = false }) {
  return <article className={`project-card project-branded ${featured ? 'featured-card' : ''}`} style={projectBrandStyle(project)}>
    <ProjectLogo project={project} />
    <div className="project-card-body">
      <div className="card-topline">
        <span className="type-label">{typeLabels[project.type] || typeLabels.other}</span>
        {featured && <span className="featured-ribbon">추천</span>}
      </div>
      <h3>{project.title}</h3>
      <div className="project-release-line"><span>{project.version || '버전 미정'}</span><span className={`status-badge status-${project.status}`}>{statusLabels[project.status] || project.status}</span></div>
      {project.prerelease && <div className="project-prerelease-line"><span>PRE-RELEASE</span><strong>{project.prerelease.version}</strong><time dateTime={project.prerelease.releaseDate}>{project.prerelease.releaseDate}</time></div>}
      <p className="project-summary">{project.description}</p>
      <div className="chip-row">{(project.platform || []).map((platform) => <span className="chip" key={platform}>{platform}</span>)}</div>
      <div className="card-footer">
        <span>{project.lastUpdated || '업데이트 미정'}</span>
        <button type="button" onClick={() => onOpen(project.id)} aria-label={`${project.title} 상세보기`}>상세보기 <ArrowUpRight size={17} /></button>
      </div>
    </div>
  </article>
}
