import { ArrowLeft, ArrowUpRight, CalendarDays, Github } from 'lucide-react'
import DownloadSection from './DownloadSection'
import BrowserPatcher from './BrowserPatcher'
import HashInfo from './HashInfo'
import ProjectLogo from './ProjectLogo'
import ScreenshotGallery from './ScreenshotGallery'
import UpdateTimeline from './UpdateTimeline'
import { projectBrandStyle, statusLabels, typeLabels } from '../utils/projectMeta'

function ListBlock({ title, items, emphasis = false, headingLevel = 3 }) {
  if (!items?.length) return null
  const Heading = `h${headingLevel}`
  return <div className={`info-block ${emphasis ? 'warning-note' : ''}`}><Heading>{title}</Heading><ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
}

function jumpTo(id) {
  const section = document.getElementById(id)
  const target = section?.querySelector('h2, summary') || section
  target?.setAttribute('tabindex', '-1')
  target?.focus({ preventScroll: true })
  section?.scrollIntoView({ block: 'start' })
}

export default function ProjectDetail({ project, changelog, onBack, onOpenUpdates }) {
  if (!project) return <main className="not-found section-pad" id="main-content"><span>404</span><h1>프로젝트를 찾을 수 없습니다.</h1><p>주소가 바뀌었거나 데이터에서 제거된 항목입니다.</p><button className="button primary" type="button" onClick={onBack}><ArrowLeft size={18} /> 아카이브로 돌아가기</button></main>
  const patcher = project.webPatcher || project.prerelease?.webPatcher
  const hasHashes = project.originalHash || project.patchHash || project.patchedHash || project.hashes?.length
  const hasConditions = ['requirements', 'compatibility', 'scope', 'notes'].some((field) => project[field]?.length)
  const sections = [
    ['overview', '개요'], ...(patcher ? [['browser-patcher', '웹 패처']] : []), ...(project.type === 'korean-patch' ? [] : [['download', '다운로드']]),
    ...(project.installGuide?.length ? [['installation', '설치']] : []),
    ...(hasConditions ? [['conditions', '검증·제한']] : []), ...(hasHashes ? [['integrity', '무결성']] : []),
    ['project-changelog', '업데이트'], ...(project.credits?.length || project.license ? [['credits', 'Credits·라이선스']] : []),
  ]
  const installation = <ol className="install-steps">{project.installGuide?.map((step, index) => <li key={`${step}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
  return <main className="project-detail project-branded" id="main-content" style={projectBrandStyle(project)}>
    <div className="detail-hero">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft size={18} /> 프로젝트 목록</button>
      <div className="detail-hero-grid">
        <ProjectLogo project={project} context="detail" />
        <div className="detail-heading-copy">
          <span className="type-label">{typeLabels[project.type] || typeLabels.other}</span>
          <h1>{project.title}</h1>
          {project.titleOriginal && <p className="detail-original">{project.titleOriginal}</p>}
          <p className="detail-subtitle">{project.subtitle}</p>
          {project.repository && <div className="detail-actions"><a className="button ghost" href={project.repository} target="_blank" rel="noreferrer"><Github size={17} /> GitHub 저장소</a></div>}
        </div>
      </div>
      <dl className="detail-facts">
        <div><dt>상태</dt><dd>{statusLabels[project.status] || project.status}</dd></div>
        <div><dt>버전</dt><dd>{project.version || '미정'}</dd></div>
        <div><dt>플랫폼</dt><dd>{(project.platform || []).join(' · ') || '미정'}</dd></div>
        <div><dt>배포일</dt><dd>{project.releaseDate || '미정'}</dd></div>
      </dl>
    </div>
    <nav className="detail-jump-links" aria-label="페이지 내 빠른 이동">{sections.map(([id, label]) => <button type="button" key={id} onClick={() => jumpTo(id)}>{label}</button>)}</nav>
    <div className="detail-layout section-pad">
      <div className="detail-main">
        <section className="detail-section intro-section" id="overview"><div className="detail-section-title"><h2>프로젝트 개요</h2></div><p className="lead-description">{project.description}</p><ListBlock title="핵심 기능" items={project.features} /></section>
        <ScreenshotGallery screenshots={project.screenshots} />
        <BrowserPatcher project={project} />
        <DownloadSection project={project} />
        {project.installGuide?.length > 0 && <section className="detail-section" id="installation">{patcher ? <details><summary>웹 패처 사용·기기 배치 안내</summary>{installation}</details> : <><div className="detail-section-title"><h2>설치·사용 안내</h2></div>{installation}</>}</section>}
        {hasConditions && <section className="detail-section" id="conditions"><div className="detail-section-title"><h2>지원 및 검증 범위</h2></div>
          <div className="condition-group"><h3>사용 조건과 검증 범위</h3><ListBlock headingLevel={4} title="준비할 환경·파일" items={project.requirements} /><ListBlock headingLevel={4} title="확인된 환경·사용 범위" items={project.compatibility} /></div>
          {project.scope?.length > 0 && <details className="technical-scope"><summary>기술적 작업 범위</summary><ul>{project.scope.map((item) => <li key={item}>{item}</li>)}</ul></details>}
          <ListBlock title="주의 및 제한" items={project.notes} emphasis />
        </section>}
        <HashInfo project={project} />
        <section className="detail-section project-changelog-section" id="project-changelog" aria-labelledby="project-changelog-title"><div className="detail-section-title"><h2 id="project-changelog-title">최신 업데이트</h2></div><UpdateTimeline changelog={changelog} compact limit={1} /><button className="button ghost" type="button" onClick={() => onOpenUpdates(project.id)}>전체 업데이트 기록 보기 <ArrowUpRight size={17} /></button></section>
        {(project.credits?.length > 0 || project.license) && <section className="detail-section credit-card" id="credits"><div className="detail-section-title"><h2>Credits·라이선스</h2></div>{project.credits?.length > 0 && <ul>{project.credits.map((credit, index) => <li key={index}>{typeof credit === 'string' ? credit : <><span>{credit.role}</span><a href={credit.url} target="_blank" rel="noreferrer">{credit.name}</a></>}</li>)}</ul>}{project.license && <p>{project.license}</p>}</section>}
      </div>
      <aside className="detail-aside" aria-label="프로젝트 부가 정보">
        {(project.fileSize || project.lastUpdated) && <dl className="aside-facts">{project.fileSize && <div><dt>파일 크기</dt><dd>{project.fileSize}</dd></div>}{project.lastUpdated && <div><dt><CalendarDays size={15} /> 최종 업데이트</dt><dd>{project.lastUpdated}</dd></div>}</dl>}
        {project.credits?.length > 0 && <button type="button" className="back-button" onClick={() => jumpTo('credits')}>Credits·출처 확인 <ArrowUpRight size={16} /></button>}
        {project.tags?.length > 0 && <div className="chip-row">{project.tags.map((tag) => <span className="chip" key={tag}>#{tag}</span>)}</div>}
      </aside>
    </div>
  </main>
}
