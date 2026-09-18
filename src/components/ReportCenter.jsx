import { useEffect, useRef, useState } from 'react'
import { Copy, ExternalLink, MessageSquare, RefreshCw } from 'lucide-react'
import site from '../data/site.json'
import { buildReport, fetchReportIssues, githubRepository, reportKinds, reportStatus, reportStatuses } from '../utils/reports'

function ProjectReports({ project }) {
  const repository = githubRepository(project.reportRepository || project.repository).url
  const [fields, setFields] = useState({ kind: 'bug', title: '', version: project.version || '', environment: '', description: '', steps: '', expected: '' })
  const [draft, setDraft] = useState(null)
  const [message, setMessage] = useState('')
  const [feed, setFeed] = useState({ kind: 'idle', issues: [] })
  const [filter, setFilter] = useState('all')
  const request = useRef(null)
  const prepared = useRef(null)

  useEffect(() => () => { const controller = request.current; request.current = null; controller?.abort() }, [])
  useEffect(() => { if (draft) prepared.current?.focus() }, [draft])

  const change = event => {
    setFields(current => ({ ...current, [event.target.name]: event.target.value }))
    setDraft(null)
    setMessage('')
  }
  const prepare = event => {
    event.preventDefault()
    if (!fields.title.trim() || !fields.description.trim()) return setMessage('제목과 내용을 입력해 주세요.')
    setDraft(buildReport(project, fields))
    setMessage('')
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft.title + '\n\n' + draft.body)
      setMessage('제보 내용을 복사했습니다. GitHub 작성 화면에 붙여 넣어 주세요.')
    } catch {
      setMessage('자동 복사가 되지 않았습니다. 아래 미리보기의 내용을 선택해 복사해 주세요.')
    }
  }
  const loadIssues = async () => {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setFeed({ kind: 'loading', issues: [] })
    const timer = window.setTimeout(() => controller.abort(), 15000)
    try {
      const data = await fetchReportIssues(repository, { signal: controller.signal, projectId: project.reportRepository ? project.id : undefined })
      if (request.current !== controller) return
      setFeed({ ...data, kind: 'ready', loadedAt: new Date().toLocaleTimeString('ko-KR') })
    } catch (error) {
      if (request.current !== controller) return
      const message = controller.signal.aborted ? '조회 시간이 초과됐습니다. 다시 시도하거나 GitHub 이슈 목록을 열어 주세요.' : error instanceof TypeError || error instanceof SyntaxError ? '네트워크 연결이나 GitHub 응답을 확인할 수 없습니다. 다시 시도하거나 GitHub 이슈 목록을 열어 주세요.' : error.message
      setFeed({ kind: 'error', issues: [], message })
    } finally { window.clearTimeout(timer) }
  }
  const visible = feed.issues.filter(issue => filter === 'all' || reportStatus(issue) === filter)
  return <>
    <p className="report-intro">오류·오역·개선 의견과 사용 후기를 남겨 주세요. <strong>GitHub 로그인 후 최종 등록</strong>하며, 등록된 제보와 댓글은 공개됩니다. 스크린샷은 GitHub 작성 화면에서 첨부할 수 있습니다.</p>
    <p className="report-notice">비밀글은 지원하지 않습니다. 개인정보·인증 정보·ROM·BIOS 파일은 첨부하지 마세요.</p>
    {project.reportRepository && <p className="report-feed-note">이 프로젝트의 제보는 포털 저장소에 접수하며, 아래 현황에는 이 프로젝트의 제보만 표시합니다.</p>}
    <details className="report-compose">
      <summary><MessageSquare size={18} aria-hidden="true" /> 제보하기</summary>
      <form className="report-form" onSubmit={prepare}>
        <div className="report-field-grid">
          <label>제보 종류<select name="kind" value={fields.kind} onChange={change}>{Object.entries(reportKinds).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>사용 버전<input name="version" value={fields.version} onChange={change} maxLength={100} placeholder="예: v1.1a" /></label>
        </div>
        <label>제목 <span>(필수)</span><input name="title" value={fields.title} onChange={change} required maxLength={100} placeholder="어떤 문제가 발생했나요?" /></label>
        <label>실행 환경<input name="environment" value={fields.environment} onChange={change} maxLength={200} placeholder="기기·에뮬레이터·브라우저·운영체제와 버전" /></label>
        <label>제보 내용 <span>(필수)</span><textarea name="description" value={fields.description} onChange={change} required maxLength={2000} rows={5} placeholder="발생한 문제 또는 남기고 싶은 의견을 적어 주세요." /></label>
        <label>재현 순서·발생 위치<textarea name="steps" value={fields.steps} onChange={change} maxLength={1500} rows={3} placeholder="메뉴·대사·발생 장소, 문제를 다시 확인할 수 있는 순서" /></label>
        <label>기대 결과·수정 의견<textarea name="expected" value={fields.expected} onChange={change} maxLength={1000} rows={3} placeholder="원하는 동작, 제안 번역과 변경 이유" /></label>
        <button className="button primary" type="submit">제보 내용 확인</button>
      </form>
      {draft && <div className="report-prepared" ref={prepared} tabIndex={-1}>
        <h3>GitHub에서 최종 등록해 주세요</h3>
        <p>아직 접수되지 않았습니다. 아래 버튼으로 작성 화면을 열고 내용을 확인한 뒤 등록하면 제보가 접수됩니다.</p>
        {draft.tooLong && <p className="report-notice">내용이 길어 링크로 전달할 수 없습니다. 내용을 복사한 뒤 GitHub의 제목과 본문에 붙여 넣어 주세요.</p>}
        <div className="report-actions">
          <a className="button primary" href={draft.tooLong ? repository + '/issues/new' : draft.url} target="_blank" rel="noreferrer">GitHub에서 제보 등록 <ExternalLink size={16} aria-hidden="true" /></a>
          <button className="button ghost" type="button" onClick={copy}><Copy size={16} aria-hidden="true" /> 제보 내용 복사</button>
        </div>
        <details><summary>작성 내용 미리보기</summary><pre>{draft.title + '\n\n' + draft.body}</pre></details>
      </div>}
      {message && <p role="status">{message}</p>}
    </details>
    <div className="report-status-panel">
      <div className="report-panel-title"><h3>제보 처리 현황</h3><button type="button" className="button ghost" onClick={loadIssues} disabled={feed.kind === 'loading'}><RefreshCw size={16} aria-hidden="true" /> {feed.kind === 'loading' ? '불러오는 중…' : feed.kind === 'ready' ? '새로고침' : '현황 불러오기'}</button></div>
      {feed.kind === 'idle' && <p>현황을 불러오면 이 저장소의 공개 이슈와 처리 상태를 확인할 수 있습니다.</p>}
      {feed.kind === 'loading' && <p role="status">GitHub 이슈를 확인하고 있습니다.</p>}
      {feed.kind === 'error' && <p className="report-notice" role="status">{feed.message}</p>}
      <dl className="report-counts">{Object.entries(reportStatuses).map(([status, label]) => <div key={status} className={'report-' + status}><dt>{label}</dt><dd>{feed.kind === 'ready' ? feed.issues.filter(issue => reportStatus(issue) === status).length : '—'}</dd></div>)}</dl>
      {feed.kind === 'ready' && <>
        <p className="report-feed-note">{feed.partial ? '최근 업데이트된 GitHub 항목 최대 100개 중 해당 이슈 ' + feed.issues.length + '건 기준입니다. 이전 기록은 GitHub에서 확인하세요.' : '공개 이슈 ' + feed.issues.length + '건 기준입니다.'} · 조회 {feed.loadedAt}</p>
        <details className="report-list"><summary>제보 목록 펼치기 · {feed.issues.length}건</summary>
          <label>처리 상태<select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">전체</option>{Object.entries(reportStatuses).map(([status, label]) => <option key={status} value={status}>{label}</option>)}</select></label>
          {visible.length ? <ul>{visible.map(issue => <li key={issue.number}><span className={'report-state report-' + reportStatus(issue)}>{reportStatuses[reportStatus(issue)]}</span><a href={repository + '/issues/' + issue.number} target="_blank" rel="noreferrer">#{issue.number} {issue.title} <ExternalLink size={14} aria-hidden="true" /></a></li>)}</ul> : <p>표시할 제보가 없습니다.</p>}
        </details>
      </>}
      <details className="report-feed-note"><summary>처리 상태 안내</summary><p>새로 열린 이슈는 접수, 관리자가 확인 표시한 이슈는 확인으로 분류합니다. 완료 처리한 이슈는 해결, 그 외 닫힌 이슈는 종료로 표시합니다. 사용 후기도 같은 이슈 목록에 포함됩니다.</p></details>
      <a className="report-all-link" href={repository + '/issues'} target="_blank" rel="noreferrer">GitHub에서 전체 제보·댓글 보기 <ExternalLink size={15} aria-hidden="true" /></a>
    </div>
  </>
}

export default function ReportCenter({ project, projects = [] }) {
  const portal = { id: 'portal', title: '웹페이지·자료실', repository: site.repository }
  const [selectedId, setSelectedId] = useState('portal')
  const selected = project || projects.find(item => item.id === selectedId) || portal
  return <section className={project ? 'detail-section report-center' : 'report-center section-pad'} id="reports" aria-labelledby="report-title">
    <div className="detail-section-title"><h2 id="report-title">제보·사용 후기</h2></div>
    {!project && <label className="report-project-select">제보할 프로젝트<select value={selected.id} onChange={event => setSelectedId(event.target.value)}><option value="portal">웹페이지·자료실</option>{projects.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>}
    <ProjectReports key={selected.id} project={selected} />
  </section>
}
