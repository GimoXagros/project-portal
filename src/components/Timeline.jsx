import { ArrowUpRight } from 'lucide-react'
import ProjectLogo from './ProjectLogo'
import { projectBrandStyle } from '../utils/projectMeta'
import SectionHeading from './SectionHeading'

export default function Timeline({ updates, projects }) {
  if (!updates.length) return null
  return <section className="timeline-section section-pad" id="updates" aria-labelledby="updates-title">
    <SectionHeading index="03" eyebrow="PROJECT NOTES" title="프로젝트별 최근 기록" description="서로 다른 프로젝트의 변경 이력을 섞지 않고, 각 작업 노트의 최신 항목만 모았습니다." />
    <div className="latest-update-grid">{updates.map((update) => {
      const project = projects.find((item) => item.id === update.projectId)
      if (!project) return null
      return <article className="latest-update-card project-branded" style={projectBrandStyle(project)} key={update.projectId}>
        <ProjectLogo project={project} context="update" />
        <div><div className="update-card-meta"><time dateTime={update.date}>{update.date}</time><code>{update.version}</code></div><h3>{project.title}</h3><p>{update.summary}</p><a href={`#/updates/${project.id}`}>업데이트 기록 <ArrowUpRight size={16} /></a></div>
      </article>
    })}</div>
    <a className="all-updates-link" href="#/updates">프로젝트별 전체 업데이트 보기 <ArrowUpRight size={17} /></a>
  </section>
}
