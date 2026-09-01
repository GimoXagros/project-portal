import ProjectCard from './ProjectCard'
import SectionHeading from './SectionHeading'

export default function FeaturedProjects({ projects, onOpen }) {
  const featured = projects.filter((project) => project.featured)
  if (!featured.length) return null
  return <section className="featured-section section-pad" aria-labelledby="featured-title">
    <SectionHeading index="01" eyebrow="FEATURED" title="주요 프로젝트" description="featured 값이 true인 항목만 이 영역에 표시됩니다. 실제 항목이 없으면 섹션 전체가 사라집니다." />
    <div className="featured-grid">{featured.map((project) => <ProjectCard project={project} onOpen={onOpen} featured key={project.id} />)}<div className="featured-note"><span>EDITOR'S SHELF</span><strong>실제 프로젝트를<br />선정하면 이 자리에<br />강조해 전시합니다.</strong><p>현재는 SAMPLE 카드로 강조 레이아웃만 확인합니다.</p></div></div>
  </section>
}
