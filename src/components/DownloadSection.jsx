import { Download, ExternalLink, FileArchive, Github, PackageOpen } from 'lucide-react'
import { hasDownload } from '../utils/projectMeta'

function DownloadLink({ item, enabled }) {
  const ready = enabled && Boolean(item.url)
  return ready ? <a className="download-row" href={item.url} target="_blank" rel="noreferrer"><span><FileArchive size={18} /><strong>{item.label}</strong>{item.filename && <small>{item.filename}</small>}</span><span>{item.size || '크기 미표기'} <Download size={17} /></span></a>
    : <div className="download-row disabled" aria-disabled="true"><span><FileArchive size={18} /><strong>{item.label}</strong>{item.filename && <small>{item.filename}</small>}</span><span>{item.size || '배포 준비 중'} <PackageOpen size={17} /></span></div>
}

export default function DownloadSection({ project }) {
  const enabled = hasDownload(project)
  const downloads = project.downloads || []
  return <section className="detail-section download-section" aria-labelledby="download-title">
    <div className="detail-section-title"><span>DOWNLOAD</span><h2 id="download-title">다운로드</h2></div>
    <div className={`download-callout ${enabled ? 'ready' : ''}`}>
      <div><span className="download-state">{enabled ? 'AVAILABLE' : 'NOT YET AVAILABLE'}</span><h3>{enabled ? '공식 배포 파일' : '배포 준비 중'}</h3><p>{enabled ? '프로젝트가 지정한 공식 배포 파일입니다.' : '실제 GitHub Releases 또는 다운로드 파일이 아직 연결되지 않았습니다.'}</p></div>
      {enabled && project.downloadUrl ? <a className="button primary" href={project.downloadUrl} target="_blank" rel="noreferrer"><Download size={18} /> 파일 받기</a> : <button className="button primary" type="button" disabled><PackageOpen size={18} /> 배포 준비 중</button>}
    </div>
    {downloads.length > 0 && <div className="download-list">{downloads.map((item, index) => <div key={`${item.label}-${index}`}>
      <DownloadLink item={item} enabled={project.downloadEnabled} />
      {(item.parts || []).length > 0 && <div className="part-list"><p>분할 파일은 모든 파트를 받은 뒤 프로젝트 안내에 따라 결합해야 합니다.</p>{item.parts.map((part, partIndex) => <DownloadLink item={part} enabled={project.downloadEnabled} key={`${part.label}-${partIndex}`} />)}</div>}
    </div>)}</div>}
    <div className="external-actions">
      {project.repository && <a href={project.repository} target="_blank" rel="noreferrer"><Github size={17} /> Repository <ExternalLink size={14} /></a>}
      {project.releaseUrl && <a href={project.releaseUrl} target="_blank" rel="noreferrer"><PackageOpen size={17} /> Releases <ExternalLink size={14} /></a>}
      {project.issuesUrl && <a href={project.issuesUrl} target="_blank" rel="noreferrer">Issues <ExternalLink size={14} /></a>}
      {!project.repository && !project.releaseUrl && !project.issuesUrl && <p className="quiet-note">저장소와 Releases 링크는 실제 프로젝트 선정 후 연결합니다.</p>}
    </div>
  </section>
}
