import { ArrowLeft, CalendarDays, Tag } from 'lucide-react'
import DownloadSection from './DownloadSection'
import HashInfo from './HashInfo'
import ScreenshotGallery from './ScreenshotGallery'
import { statusLabels, typeLabels } from '../utils/projectMeta'

function ListBlock({ title, items }) {
  if (!items?.length) return null
  return <div className="info-block"><h3>{title}</h3><ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
}

export default function ProjectDetail({ project, onBack }) {
  if (!project) return <main className="not-found section-pad" id="main-content"><span>404</span><h1>프로젝트를 찾을 수 없습니다.</h1><p>주소가 바뀌었거나 데이터에서 제거된 항목입니다.</p><button className="button primary" type="button" onClick={onBack}><ArrowLeft size={18} /> 아카이브로 돌아가기</button></main>
  return <main className="project-detail" id="main-content">
    <div className="detail-hero">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft size={18} /> 프로젝트 목록</button>
      <div className="detail-hero-grid">
        <div><div className="card-topline"><span className="type-label">{typeLabels[project.type] || typeLabels.other}</span></div><h1>{project.title}</h1>{project.titleOriginal && <p className="detail-original">{project.titleOriginal}</p>}<p className="detail-subtitle">{project.subtitle}</p></div>
        <div className={`detail-cover tone-${project.coverTone || 'slate'}`}><span>{project.id.slice(0, 2).toUpperCase()}</span><small>{project.id}</small></div>
      </div>
      <dl className="detail-facts">
        <div><dt>상태</dt><dd><span className={`status-badge status-${project.status}`}>{statusLabels[project.status] || project.status}</span></dd></div>
        <div><dt>버전</dt><dd>{project.version || '미정'}</dd></div>
        <div><dt>플랫폼</dt><dd>{(project.platform || []).join(' · ') || '미정'}</dd></div>
        <div><dt>배포일</dt><dd>{project.releaseDate || '미정'}</dd></div>
      </dl>
    </div>
    <div className="detail-layout section-pad">
      <div className="detail-main">
        <section className="detail-section intro-section"><div className="detail-section-title"><span>OVERVIEW</span><h2>프로젝트 소개</h2></div><p className="lead-description">{project.description}</p></section>
        <ScreenshotGallery screenshots={project.screenshots} />
        <section className="detail-section"><div className="detail-section-title"><span>SPECIFICATION</span><h2>지원 정보</h2></div><div className="info-grid"><ListBlock title="주요 특징" items={project.features} /><ListBlock title="수정·작업 범위" items={project.scope} /><ListBlock title="요구 사항" items={project.requirements} /><ListBlock title="호환성" items={project.compatibility} /></div></section>
        {project.installGuide?.length > 0 && <section className="detail-section"><div className="detail-section-title"><span>INSTALLATION</span><h2>설치 안내</h2></div><ol className="install-steps">{project.installGuide.map((step, index) => <li key={`${step}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol></section>}
        <HashInfo project={project} />
        <DownloadSection project={project} />
      </div>
      <aside className="detail-aside" aria-label="프로젝트 부가 정보">
        {project.notes?.length > 0 && <div className="aside-card"><h2>주의사항</h2><ul>{project.notes.map((note, index) => <li key={`${note}-${index}`}>{note}</li>)}</ul></div>}
        {project.credits?.length > 0 && <div className="aside-card credit-card"><h2>Credits</h2><ul>{project.credits.map((credit, index) => <li key={`${credit.name || credit}-${index}`}>{typeof credit === 'string' ? credit : <><span>{credit.role}</span><a href={credit.url} target="_blank" rel="noreferrer">{credit.name}</a></>}</li>)}</ul></div>}
        {(project.license || project.fileSize || project.lastUpdated) && <dl className="aside-facts">{project.license && <div><dt><Tag size={15} /> License</dt><dd>{project.license}</dd></div>}{project.fileSize && <div><dt>File size</dt><dd>{project.fileSize}</dd></div>}{project.lastUpdated && <div><dt><CalendarDays size={15} /> Updated</dt><dd>{project.lastUpdated}</dd></div>}</dl>}
        {project.tags?.length > 0 && <div className="chip-row">{project.tags.map((tag) => <span className="chip" key={tag}>#{tag}</span>)}</div>}
      </aside>
    </div>
  </main>
}
