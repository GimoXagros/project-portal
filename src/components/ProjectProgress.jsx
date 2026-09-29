const statusLabels = {
  complete: '완료',
  'in-progress': '진행 중',
  'not-started': '시작 전',
  unverified: '확인 필요',
}

export default function ProjectProgress({ project, compact = false }) {
  const progress = project.progress
  if (project.type !== 'korean-patch' || !progress?.stages?.length) return null
  const Container = compact ? 'div' : 'section'
  const Heading = compact ? 'h4' : 'h2'
  const titleId = `${project.id}-progress-title${compact ? '-card' : ''}`

  return <Container className={`project-progress ${compact ? 'progress-compact' : 'detail-section'}`} id={compact ? undefined : 'translation-progress'} aria-labelledby={titleId}>
    <div className="progress-heading"><Heading id={titleId}>한글화 진행 현황</Heading>{!compact && progress.updatedAt && <span>확인 기준 <time dateTime={progress.updatedAt}>{progress.updatedAt}</time></span>}</div>
    {!compact && progress.summary && <p className="progress-summary">{progress.summary}</p>}
    <ul className="progress-stages">{progress.stages.map((stage) => {
      const measured = typeof stage.percent === 'number' && Number.isFinite(stage.percent) && stage.percent >= 0 && stage.percent <= 100
      return <li className={`progress-stage progress-${stage.status}`} key={stage.id}>
        <div className="progress-stage-heading"><span className="progress-stage-label">{stage.label}</span><span className="progress-stage-value">{measured ? `${stage.percent}%` : '진행률 미공개'}</span></div>
        {measured && <div className="progress-track" role="progressbar" aria-label={`${project.title} · ${stage.label}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={stage.percent} aria-valuetext={`${stage.percent}% · ${statusLabels[stage.status] || '확인 필요'}`}><span style={{ width: `${stage.percent}%` }} /></div>}
        <div className="progress-stage-status"><span>{statusLabels[stage.status] || '확인 필요'}</span>{!compact && stage.sourceUrl && <a href={stage.sourceUrl} target="_blank" rel="noreferrer" aria-label={`${stage.label} 진행 현황 근거 보기`}>근거 보기 ↗</a>}</div>
        {!compact && stage.detail && <p>{stage.detail}</p>}
      </li>
    })}</ul>
    {!compact && <p className="progress-footnote">각 단계의 공개 자료를 기준으로 표시합니다. 수치가 공개되지 않은 항목은 백분율로 환산하지 않습니다.</p>}
  </Container>
}
