export const reportKinds = {
  bug: '오류·멈춤·화면 깨짐',
  translation: '오역·표기·용어',
  suggestion: '개선 제안',
  feedback: '응원·사용 후기',
}

export const reportStatuses = { received: '접수', confirmed: '확인', resolved: '해결', closed: '종료' }

export function githubRepository(repository) {
  const match = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/?$/.exec(repository || '')
  if (!match) throw new Error('GitHub 저장소 주소를 확인해 주세요.')
  return { path: match[1] + '/' + match[2], url: 'https://github.com/' + match[1] + '/' + match[2] }
}

export function reportStatus(issue) {
  if (issue.state === 'closed') return issue.state_reason === 'completed' ? 'resolved' : 'closed'
  const confirmed = new Set(['confirmed', 'triaged', 'in-progress', 'in progress', 'status:confirmed', '확인', '확인됨', '진행중', '진행 중'])
  return (issue.labels || []).some(label => confirmed.has((typeof label === 'string' ? label : label.name || '').toLowerCase())) ? 'confirmed' : 'received'
}

export function buildReport(project, fields) {
  const repository = githubRepository(project.reportRepository || project.repository).url
  const kind = reportKinds[fields.kind] || reportKinds.bug
  const title = '[' + kind + '] ' + fields.title.trim()
  const body = [
    '## 프로젝트', project.title,
    '## 제보 종류', kind,
    '## 사용 버전', fields.version.trim() || '미기재',
    '## 실행 환경', fields.environment.trim() || '미기재',
    '## 제보 내용', fields.description.trim(),
    '## 재현 순서·발생 위치', fields.steps.trim() || '해당 없음',
    '## 기대 결과·수정 의견', fields.expected.trim() || '미기재',
    '---', 'Project Portal 웹 제보 양식에서 작성했습니다.',
    '<!-- portal-project:' + project.id + ' -->',
  ].join('\n\n')
  const url = new URL(repository + '/issues/new')
  // Only title/body: labels and assignees require repository permissions.
  url.searchParams.set('title', title)
  url.searchParams.set('body', body)
  return { title, body, url: url.href, tooLong: url.href.length > 7000 }
}

export async function fetchReportIssues(repository, { signal, projectId, fetcher = fetch } = {}) {
  const { path } = githubRepository(repository)
  const response = await fetcher('https://api.github.com/repos/' + path + '/issues?state=all&sort=updated&direction=desc&per_page=100', {
    signal, headers: { Accept: 'application/vnd.github+json' },
  })
  if (!response.ok) {
    if ([403, 429].includes(response.status)) throw new Error('GitHub 조회 한도에 도달했거나 접근이 제한됐습니다. 잠시 후 다시 조회하거나 GitHub 이슈 목록을 열어 주세요.')
    if (response.status === 404) throw new Error('이슈 목록에 접근할 수 없습니다. 저장소에서 이슈가 활성화되어 있는지 확인해 주세요.')
    throw new Error('처리 현황을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
  }
  const data = await response.json()
  if (!Array.isArray(data)) throw new Error('처리 현황 응답을 읽을 수 없습니다.')
  return {
    issues: data.filter(issue => issue && !issue.pull_request && Number.isSafeInteger(issue.number) && issue.number > 0 && ['open', 'closed'].includes(issue.state) && typeof issue.title === 'string' && (!projectId || (issue.body || '').includes('<!-- portal-project:' + projectId + ' -->'))),
    partial: /rel="next"/.test(response.headers.get('link') || ''),
  }
}
