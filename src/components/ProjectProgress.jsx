export default function ProjectProgress({ project, compact = false }) {
  const progress = project.progress
  if (project.type !== 'korean-patch' || !progress?.stages?.length) return null
  const Container = compact ? 'div' : 'section'
  const Heading = compact ? 'h4' : 'h2'
  const titleId = `${project.id}-progress-title${compact ? '-card' : ''}`

  return <Container className={`project-progress ${compact ? 'progress-compact' : 'detail-section'}`} id={compact ? undefined : 'translation-progress'} aria-labelledby={titleId}>
    <div className="progress-heading"><Heading id={titleId}>한글화 진행 현황</Heading></div>
    <ul className="progress-stages">{progress.stages.map((stage) => {
      const measured = typeof stage.percent === 'number' && Number.isFinite(stage.percent) && stage.percent >= 0 && stage.percent <= 100
      return <li className={`progress-stage progress-${stage.status}`} key={stage.id}>
        <span className="progress-stage-label">{stage.label}</span>
        {measured
          ? <div className="progress-track" role="progressbar" aria-label={`${project.title} · ${stage.label}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={stage.percent} aria-valuetext={`${stage.percent}%`}><span style={{ width: `${stage.percent}%` }} /></div>
          : <div className="progress-track progress-track-unknown" aria-hidden="true" />}
        <span className="progress-stage-value" aria-label={measured ? undefined : '진행률 미공개'} title={measured ? undefined : '진행률 미공개'}>{measured ? `${stage.percent}%` : '—'}</span>
      </li>
    })}</ul>
  </Container>
}
