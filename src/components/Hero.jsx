import { ArrowDownRight, Github } from 'lucide-react'
import { latestDate } from '../utils/dates'

export default function Hero({ site, projects, onNavigate }) {
  const published = projects
  const hasFeatured = published.some((project) => project.featured)
  const categoryCount = new Set(published.map((project) => project.type)).size
  const latest = latestDate(published.map((project) => project.lastUpdated))

  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero-copy-block">
      <p className="kicker">NINTENDO DS·DSi · CUSTOM RELEASE ARCHIVE</p>
      {hasFeatured && <span className="hero-release-label">현재 배포 중 · {published.filter((project) => project.featured).length} PROJECTS</span>}
      <h1 id="hero-title"><span>프로젝트를 모으고,</span><span>맥락을 기록하고,</span><em>안전하게 배포합니다.</em></h1>
      <p className="hero-copy">{site.description}</p>
      <div className="hero-actions">
        <button className="button primary" type="button" onClick={() => onNavigate('#projects')}>프로젝트 보기 <ArrowDownRight size={18} /></button>
        {site.githubUrl ? <a className="button ghost" href={site.githubUrl} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a> : <span className="mode-label">GitHub 주소 연결 전</span>}
      </div>
    </div>
    <div className="hero-side" aria-hidden="true">
      <div className="archive-mark"><span>GIMOXAGROS</span><strong>ARCHIVE</strong><small>NDS / NDSi · STATIC RELEASE INDEX</small></div>
      <div className="dial"><span>01</span><span>06</span><span>12</span><span>18</span></div>
    </div>
    <div className="hero-scrap-decor" aria-hidden="true"><span /><span /><span /></div>
    <dl className="hero-stats" aria-label="사이트 현황">
      <div><dt>공개 프로젝트</dt><dd>{published.length || '—'}</dd></div>
      <div><dt>최근 업데이트</dt><dd>{latest || '—'}</dd></div>
      <div><dt>카테고리</dt><dd>{categoryCount || '—'}</dd></div>
    </dl>
  </section>
}
