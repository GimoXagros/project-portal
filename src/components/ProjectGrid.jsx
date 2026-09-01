import { useMemo, useState } from 'react'
import ProjectCard from './ProjectCard'
import ProjectFilters from './ProjectFilters'
import SectionHeading from './SectionHeading'
import { getProjectSearchText } from '../utils/projectMeta'

export default function ProjectGrid({ projects, onOpen }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [platform, setPlatform] = useState('all')
  const platforms = useMemo(() => [...new Set(projects.flatMap((project) => project.platform || []))].sort(), [projects])
  const filtered = useMemo(() => projects.filter((project) => {
    const matchesQuery = !query || getProjectSearchText(project).includes(query.trim().toLocaleLowerCase('ko'))
    const matchesType = type === 'all' || project.type === type || (type === 'other' && !['korean-patch', 'emulator', 'port', 'tool'].includes(project.type))
    const matchesPlatform = platform === 'all' || (project.platform || []).includes(platform)
    return matchesQuery && matchesType && matchesPlatform
  }), [platform, projects, query, type])

  if (!projects.length) return <section className="projects-section section-pad" id="projects" aria-labelledby="projects-title">
    <SectionHeading index="02" eyebrow="ARCHIVE" title="프로젝트 아카이브" description="실제 게시 프로젝트가 선정되면 이곳에 표시됩니다." />
    <div className="empty-state"><span aria-hidden="true">∅</span><h3>아직 공개된 프로젝트가 없습니다.</h3><p>공개 프로젝트를 준비하고 있습니다.</p></div>
  </section>

  return <section className="projects-section section-pad" id="projects" aria-labelledby="projects-title">
    <SectionHeading index="02" eyebrow="ARCHIVE" title="프로젝트 아카이브" description="데이터 파일의 항목이 카드와 상세 화면으로 자동 변환됩니다. 현재 목록은 모두 SAMPLE입니다." />
    <ProjectFilters query={query} setQuery={setQuery} type={type} setType={setType} platform={platform} setPlatform={setPlatform} platforms={platforms} resultCount={filtered.length} />
    {filtered.length ? <div className="project-grid">{filtered.map((project) => <ProjectCard project={project} onOpen={onOpen} key={project.id} />)}</div> : <div className="empty-state"><span aria-hidden="true">∅</span><h3>조건에 맞는 프로젝트가 없습니다.</h3><p>검색어나 필터를 바꾸면 다른 SAMPLE 항목을 확인할 수 있습니다.</p></div>}
  </section>
}
