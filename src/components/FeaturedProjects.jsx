import ProjectCard from './ProjectCard'
import SectionHeading from './SectionHeading'

export default function FeaturedProjects({ projects, onOpen }) {
  const featured = projects.filter((project) => project.featured)
  if (!featured.length) return null
  return <section className="featured-section section-pad" aria-labelledby="featured-title">
    <SectionHeading index="01" eyebrow="FEATURED" title="주요 프로젝트" description="현재 배포 중인 Nintendo DS·DSi 커스텀 릴리스를 한눈에 살펴보세요." />
    <div className="featured-grid">{featured.map((project) => <ProjectCard project={project} onOpen={onOpen} featured key={project.id} />)}<div className="featured-note"><span>BEFORE DOWNLOAD</span><strong>기기와 런처에 맞는<br />빌드를 선택하세요.</strong><p>상세 페이지의 호환성, 주의사항과 SHA-256을 확인한 뒤 공식 릴리스 자산을 다운로드합니다.</p></div></div>
  </section>
}
