import { ArrowUpRight } from 'lucide-react'
import { assetUrl, statusLabels, typeLabels } from '../utils/projectMeta'

export default function ProjectCard({ project, onOpen, featured = false }) {
  return <article className={`project-card ${featured ? 'featured-card' : ''}`}>
    <div className={`project-cover tone-${project.coverTone || 'slate'}`}>
      {project.coverImage ? <img src={assetUrl(project.coverImage)} alt="" /> : <><span className="cover-code">{project.id.slice(0, 2).toUpperCase()}</span><span className="cover-label">{typeLabels[project.type]}</span></>}
    </div>
    <div className="project-card-body">
      <div className="card-topline"><span className="type-label">{typeLabels[project.type] || typeLabels.other}</span></div>
      <h3>{project.title}</h3>
      {project.titleOriginal && <p className="original-title">{project.titleOriginal}</p>}
      <p className="project-summary">{project.description}</p>
      <div className="chip-row">
        {(project.platform || []).map((platform) => <span className="chip" key={platform}>{platform}</span>)}
        <span className={`status-badge status-${project.status}`}>{statusLabels[project.status] || project.status}</span>
      </div>
      <div className="card-footer">
        <span>{project.version || '버전 미정'}</span>
        <button type="button" onClick={() => onOpen(project.id)} aria-label={`${project.title} 상세보기`}>상세보기 <ArrowUpRight size={17} /></button>
      </div>
    </div>
  </article>
}
