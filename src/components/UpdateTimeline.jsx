import { ExternalLink } from 'lucide-react'

export default function UpdateTimeline({ changelog, compact = false }) {
  const entries = changelog?.entries || []
  if (!entries.length) return <div className="update-empty"><span aria-hidden="true">∅</span><h3>아직 기록된 업데이트가 없습니다.</h3><p>새 릴리스가 확인되면 이곳에 기록합니다.</p></div>

  return <ol className={`project-update-timeline ${compact ? 'compact' : ''}`}>
    {entries.map((entry, index) => <li key={entry.id} className={index === 0 ? 'latest' : ''}>
      <div className="update-marker" aria-hidden="true"><span /></div>
      <article>
        <div className="update-meta"><time dateTime={entry.date}>{entry.date}</time><code>{entry.version}</code>{entry.status === 'prerelease' ? <b className="prerelease-badge">PRE-RELEASE</b> : index === 0 && <b>LATEST</b>}</div>
        <h3>{entry.title}</h3>
        <p>{entry.summary}</p>
        {!compact && entry.changes?.length > 0 && <ul>{entry.changes.map((change) => <li key={change}>{change}</li>)}</ul>}
        {entry.releaseUrl && <a href={entry.releaseUrl} target="_blank" rel="noreferrer">{entry.sourceLabel || 'GitHub 릴리스 보기'} <ExternalLink size={14} /></a>}
      </article>
    </li>)}
  </ol>
}
