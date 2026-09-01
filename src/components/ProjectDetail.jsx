import { ArrowLeft, ArrowUpRight, CalendarDays, Download, Github, PackageOpen, Tag } from 'lucide-react'
import DownloadSection from './DownloadSection'
import HashInfo from './HashInfo'
import ProjectLogo from './ProjectLogo'
import ScreenshotGallery from './ScreenshotGallery'
import UpdateTimeline from './UpdateTimeline'
import { projectBrandStyle, statusLabels, typeLabels } from '../utils/projectMeta'

function ListBlock({ title, items, emphasis = false }) {
  if (!items?.length) return null
  return <div className={`info-block ${emphasis ? 'warning-note' : ''}`}><h3>{title}</h3><ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
}

export default function ProjectDetail({ project, changelog, onBack, onOpenUpdates }) {
  if (!project) return <main className="not-found section-pad" id="main-content"><span>404</span><h1>프로젝트를 찾을 수 없습니다.</h1><p>주소가 바뀌었거나 데이터에서 제거된 항목입니다.</p><button className="button primary" type="button" onClick={onBack}><ArrowLeft size={18} /> 아카이브로 돌아가기</button></main>

  return <main className="project-detail project-branded" id="main-content" style={projectBrandStyle(project)}>
    <div className="detail-hero">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft size={18} /> 프로젝트 목록</button>
      <div className="detail-hero-grid">
        <ProjectLogo project={project} context="detail" />
        <div className="detail-heading-copy">
          <div className="card-topline"><span className="type-label">{typeLabels[project.type] || typeLabels.other}</span><span className={`status-badge status-${project.status}`}>{statusLabels[project.status] || project.status}</span></div>
          <h1>{project.title}</h1>
          {project.titleOriginal && <p className="detail-original">{project.titleOriginal}</p>}
          <p className="detail-subtitle">{project.subtitle}</p>
          <div className="detail-actions">
            {project.repository && <a className="button primary" href={project.repository} target="_blank" rel="noreferrer"><Github size={17} /> GitHub 저장소</a>}
            {project.releaseUrl && <a className="button ghost" href={project.releaseUrl} target="_blank" rel="noreferrer"><PackageOpen size={17} /> Releases</a>}
            <button className="button ghost" type="button" onClick={() => document.querySelector('#download')?.scrollIntoView()}><Download size={17} /> 다운로드</button>
          </div>
        </div>
      </div>
      <dl className="detail-facts">
        <div><dt>상태</dt><dd>{statusLabels[project.status] || project.status}</dd></div>
        <div><dt>버전</dt><dd>{project.version || '미정'}</dd></div>
        <div><dt>플랫폼</dt><dd>{(project.platform || []).join(' · ') || '미정'}</dd></div>
        <div><dt>배포일</dt><dd>{project.releaseDate || '미정'}</dd></div>
      </dl>
    </div>
    <div className="detail-layout section-pad">
      <div className="detail-main">
        <section className="detail-section intro-section"><div className="detail-section-title"><span>OVERVIEW</span><h2>프로젝트 소개</h2></div><p className="lead-description">{project.description}</p></section>
        <ScreenshotGallery screenshots={project.screenshots} />
        <HashInfo project={project} />
        <DownloadSection project={project} />
        {project.installGuide?.length > 0 && <section className="detail-section"><div className="detail-section-title"><span>INSTALLATION</span><h2>설치 안내</h2></div><ol className="install-steps">{project.installGuide.map((step, index) => <li key={`${step}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol></section>}
        <section className="detail-section"><div className="detail-section-title"><span>COMPATIBILITY</span><h2>호환성 및 주의사항</h2></div><div className="info-grid"><ListBlock title="주요 특징" items={project.features} /><ListBlock title="수정·작업 범위" items={project.scope} /><ListBlock title="요구 사항" items={project.requirements} /><ListBlock title="호환성" items={project.compatibility} /><ListBlock title="반드시 확인하세요" items={project.notes} emphasis /></div></section>
        <section className="detail-section project-changelog-section" aria-labelledby="project-changelog-title"><div className="detail-section-title"><span>UPDATE NOTES</span><h2 id="project-changelog-title">업데이트 기록</h2></div><UpdateTimeline changelog={changelog} compact /><button className="button ghost" type="button" onClick={() => onOpenUpdates(project.id)}>전체 업데이트 기록 보기 <ArrowUpRight size={17} /></button></section>
      </div>
      <aside className="detail-aside" aria-label="프로젝트 부가 정보">
        {project.notes?.length > 0 && <div className="aside-card warning-aside"><h2>주의사항</h2><ul>{project.notes.map((note, index) => <li key={`${note}-${index}`}>{note}</li>)}</ul></div>}
        {project.credits?.length > 0 && <div className="aside-card credit-card"><h2>Credits</h2><ul>{project.credits.map((credit, index) => <li key={`${credit.name || credit}-${index}`}>{typeof credit === 'string' ? credit : <><span>{credit.role}</span><a href={credit.url} target="_blank" rel="noreferrer">{credit.name}</a></>}</li>)}</ul></div>}
        {(project.license || project.fileSize || project.lastUpdated) && <dl className="aside-facts">{project.license && <div><dt><Tag size={15} /> License</dt><dd>{project.license}</dd></div>}{project.fileSize && <div><dt>File size</dt><dd>{project.fileSize}</dd></div>}{project.lastUpdated && <div><dt><CalendarDays size={15} /> Updated</dt><dd>{project.lastUpdated}</dd></div>}</dl>}
        {project.tags?.length > 0 && <div className="chip-row">{project.tags.map((tag) => <span className="chip" key={tag}>#{tag}</span>)}</div>}
      </aside>
    </div>
  </main>
}
