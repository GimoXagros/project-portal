import { ArrowUpRight } from 'lucide-react'
import { projectBrandStyle } from '../utils/projectMeta'
import SectionHeading from './SectionHeading'

export default function Timeline({ updates, projects }) {
  const latest = [...updates].sort((a, b) => b.date.localeCompare(a.date))
    .filter((update, index, all) => projects.some((project) => project.id === update.projectId) && all.findIndex((item) => item.projectId === update.projectId) === index).slice(0, 4)
  if (!latest.length) return null
  return <section className="timeline-section section-pad" id="updates" aria-labelledby="updates-title">
    <SectionHeading index="02" eyebrow="PROJECT NOTES" title="최근 업데이트" description="프로젝트별 최신 변경 사항입니다." />
    <ol className="update-feed">{latest.map((update) => {
      const project = projects.find((item) => item.id === update.projectId)
      return <li className="project-branded" style={projectBrandStyle(project)} key={update.projectId}>
        <time dateTime={update.date}>{update.date}</time>
        <div><div className="feed-heading"><h3><a href={`#/updates/${project.id}`}>{project.title}</a></h3><span>{update.version}</span><span>{update.status === 'prerelease' ? '프리릴리즈' : '정식'}</span></div><p>{update.summary}</p></div>
      </li>
    })}</ol>
    <a className="all-updates-link" href="#/updates">전체 업데이트 보기 <ArrowUpRight size={17} /></a>
  </section>
}
