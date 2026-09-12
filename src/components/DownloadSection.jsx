import { Check, Copy, Download, ExternalLink, FileArchive, Github, PackageOpen } from 'lucide-react'
import { useState } from 'react'
import { hasReleaseDownload, isPrereleaseChannel } from '../utils/projectMeta'

function DownloadLink({ item, enabled, copied, onCopy }) {
  const ready = enabled && Boolean(item.url)
  return <div className="download-entry">
    {ready ? <a className="download-row" href={item.url} target="_blank" rel="noreferrer"><span><FileArchive size={18} /><strong>{item.label}</strong>{item.filename && <small>{item.filename}</small>}</span><span>{item.size || '크기 미표기'} <Download size={17} /></span></a>
      : <div className="download-row disabled" aria-disabled="true"><span><FileArchive size={18} /><strong>{item.label}</strong>{item.filename && <small>{item.filename}</small>}</span><span>{item.size || '배포 준비 중'} <PackageOpen size={17} /></span></div>}
    {item.sha256 && <details className="download-integrity"><summary>SHA-256 확인 및 복사</summary><div className="download-hash"><code>{item.sha256}</code><button type="button" onClick={() => onCopy(item.sha256)} aria-label={`${item.filename || item.label} SHA-256 복사`}>{copied === item.sha256 ? <Check size={16} /> : <Copy size={16} />}<span aria-live="polite">{copied === item.sha256 ? '복사됨' : '복사'}</span></button></div></details>}
  </div>
}

function ReleaseDownloadList({ release, copied, onCopy }) {
  const downloads = release.downloads || []
  if (!downloads.length) return null
  return <div className="download-list">{downloads.map((item, index) => <div key={`${item.label}-${index}`}>
    <DownloadLink item={item} enabled={release.downloadEnabled !== false} copied={copied} onCopy={onCopy} />
    {(item.parts || []).length > 0 && <div className="part-list"><p>분할 파일은 모든 파트를 받은 뒤 프로젝트 안내에 따라 결합해야 합니다.</p>{item.parts.map((part, partIndex) => <DownloadLink item={part} enabled={release.downloadEnabled !== false} copied={copied} onCopy={onCopy} key={`${part.label}-${partIndex}`} />)}</div>}
  </div>)}</div>
}

export default function DownloadSection({ project }) {
  const versions = project.downloadVersions?.length ? project.downloadVersions : [project, ...(project.prerelease ? [project.prerelease] : [])]
  const [selectedVersion, setSelectedVersion] = useState(project.version || '')
  const [copied, setCopied] = useState('')
  const release = versions.find((item) => item.version === selectedVersion) || versions[0]
  const enabled = hasReleaseDownload(release)
  const preview = isPrereleaseChannel(release)
  const copy = async (value) => {
    try { await navigator.clipboard.writeText(value); setCopied(value) }
    catch { setCopied('') }
  }
  if (project.type === 'korean-patch') return null
  return <section className="detail-section download-section" id="download" aria-labelledby="download-title">
    <div className="detail-section-title"><h2 id="download-title">다운로드</h2></div>
    {versions.some((item) => item.version) && <div className="download-version-picker">
      <label htmlFor="download-version">다운로드 버전</label>
      <select id="download-version" value={release.version} onChange={(event) => { setSelectedVersion(event.target.value); setCopied('') }}>
        {versions.map((item) => <option key={item.version} value={item.version}>{item.version} · {isPrereleaseChannel(item) ? '프리릴리즈' : '정식판'}{item.version === project.version ? ' (기본)' : ''}</option>)}
      </select>
    </div>}
    <div className={`download-callout ${preview ? 'prerelease-callout' : ''} ${enabled ? 'ready' : ''}`}>
      <div><span className="download-state">{enabled ? (preview ? 'PRE-RELEASE' : 'STABLE') : 'NOT YET AVAILABLE'}{release.releaseDate ? ` · ${release.releaseDate}` : ''}</span>
        <h3>{enabled ? `${preview ? '프리릴리즈' : '정식 릴리스'} ${release.version}` : '배포 준비 중'}</h3>
        {release.summary && <p>{release.summary}</p>}
        {!enabled && <p>GitHub Releases 또는 다운로드 파일이 아직 연결되지 않았습니다.</p>}
      </div>
      {release.releaseUrl && <a className="button ghost" href={release.releaseUrl} target="_blank" rel="noreferrer"><PackageOpen size={17} /> 릴리스 노트</a>}
      {!enabled && <button className="button primary" type="button" disabled><PackageOpen size={18} /> 배포 준비 중</button>}
    </div>
    {release.notes?.length > 0 && <ul className="prerelease-notes">{release.notes.map((note) => <li key={note}>{note}</li>)}</ul>}
    <ReleaseDownloadList release={release} copied={copied} onCopy={copy} />
    <div className="external-actions">
      {project.upstream?.url && <a href={project.upstream.url} target="_blank" rel="noreferrer"><Github size={17} /> Upstream: {project.upstream.name} <ExternalLink size={14} /></a>}
      {project.issuesUrl && <a href={project.issuesUrl} target="_blank" rel="noreferrer">Issues <ExternalLink size={14} /></a>}
    </div>
  </section>
}
