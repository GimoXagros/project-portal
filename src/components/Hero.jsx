import { ArrowDownRight, Github } from 'lucide-react'

export default function Hero({ site, projects, onNavigate }) {
  const published = projects.filter((project) => !project.demo)
  const categoryCount = new Set(published.map((project) => project.type)).size
  const latest = published.map((project) => project.lastUpdated).filter(Boolean)[0]

  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero-copy-block">
      <p className="kicker">PERSONAL GAME PROJECT ARCHIVE · DEMO MODE</p>
      <h1 id="hero-title">프로젝트를 모으고,<br />맥락을 기록하고,<br /><em>안전하게 배포합니다.</em></h1>
      <p className="hero-copy">{site.description}</p>
      <div className="hero-actions">
        <button className="button primary" type="button" onClick={() => onNavigate('#projects')}>프로젝트 보기 <ArrowDownRight size={18} /></button>
        {site.githubUrl ? <a className="button ghost" href={site.githubUrl} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a> : <span className="mode-label">GitHub 주소 연결 전</span>}
      </div>
    </div>
    <div className="hero-side" aria-hidden="true">
      <div className="archive-mark"><span>PROJECT</span><strong>CABINET</strong><small>KO / EN · STATIC ARCHIVE</small></div>
      <div className="dial"><span>01</span><span>06</span><span>12</span><span>18</span></div>
    </div>
    <dl className="hero-stats" aria-label="사이트 현황">
      <div><dt>공개 프로젝트</dt><dd>{published.length || '—'}</dd></div>
      <div><dt>최근 업데이트</dt><dd>{latest || 'DEMO'}</dd></div>
      <div><dt>카테고리</dt><dd>{categoryCount || 'DEMO'}</dd></div>
    </dl>
  </section>
}
