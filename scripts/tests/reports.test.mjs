import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildReport, fetchReportIssues, githubRepository, reportStatus } from '../../src/utils/reports.js'

const project = { id: 'gba-narikiri3-kor', title: '나리키리 던전3', version: 'v1.1a', repository: 'https://github.com/GimoXagros/gba-narikiri3-kor' }
const fields = { kind: 'translation', title: '이름 & 표기 # 오류?', version: 'v1.1a', environment: 'mGBA', description: '본문\n두 번째 줄 + & = #?', steps: '상점 → 대사', expected: '교정 의견' }

test('report composer preserves Korean, newlines and URL metacharacters in the correct repository', () => {
  const result = buildReport(project, fields)
  const url = new URL(result.url)
  assert.equal(url.origin + url.pathname, project.repository + '/issues/new')
  assert.equal(url.searchParams.get('title'), '[오역·표기·용어] ' + fields.title)
  assert.equal(url.searchParams.get('body'), result.body)
  assert.ok(result.body.includes(fields.description))
  assert.ok(result.body.includes(fields.environment))
  assert.deepEqual([...url.searchParams.keys()], ['title', 'body'])
  assert.equal(result.tooLong, false)
})

test('long reports offer a copy fallback without truncating the content', () => {
  const content = '한글 내용 &\n'.repeat(1000)
  const result = buildReport(project, { ...fields, description: content })
  assert.equal(result.tooLong, true)
  assert.ok(result.body.includes(content.trim()))
})

test('closed as not planned is never counted as resolved; confirmation is explicit', () => {
  assert.equal(reportStatus({ state: 'open', labels: [{ name: 'bug' }] }), 'received')
  assert.equal(reportStatus({ state: 'open', labels: [{ name: 'confirmed' }] }), 'confirmed')
  assert.equal(reportStatus({ state: 'open', labels: ['확인'] }), 'confirmed')
  assert.equal(reportStatus({ state: 'closed', state_reason: 'completed', labels: ['confirmed'] }), 'resolved')
  for (const state_reason of ['not_planned', null, undefined]) assert.equal(reportStatus({ state: 'closed', state_reason }), 'closed')
})

test('unsafe repository addresses cannot generate issue links or requests', () => {
  for (const repository of ['https://example.com/a/b', 'https://github.com/a/b?token=x', 'https://github.com/a/b/issues', 'https://github.com@evil.test/a/b']) assert.throws(() => githubRepository(repository))
})

test('disabled issue repositories use the portal and isolate project reports', async () => {
  const fallback = { ...project, id: 'gameyob', reportRepository: 'https://github.com/GimoXagros/project-portal' }
  const report = buildReport(fallback, fields)
  assert.equal(new URL(report.url).pathname, '/GimoXagros/project-portal/issues/new')
  const data = await fetchReportIssues(fallback.reportRepository, { projectId: 'gameyob', fetcher: async () => new Response(JSON.stringify([
    { number: 1, title: 'GameYob', state: 'open', body: report.body },
    { number: 2, title: '다른 프로젝트', state: 'open', body: '<!-- portal-project:nitroswan -->' },
    { number: 3, title: '웹사이트', state: 'open', body: '페이지 오류' },
  ])) })
  assert.deepEqual(data.issues.map(issue => issue.number), [1])
})

test('issue feed excludes pull requests and invalid records and marks incomplete counts', async () => {
  const controller = new AbortController()
  const result = await fetchReportIssues(project.repository, { signal: controller.signal, fetcher: async (url, options) => {
    assert.equal(new URL(url).searchParams.get('state'), 'all')
    assert.equal(options.signal, controller.signal)
    assert.equal(options.headers.Authorization, undefined)
    return new Response(JSON.stringify([
      { number: 1, title: '오류', state: 'open' },
      { number: 2, title: 'PR', state: 'closed', pull_request: {} },
      { number: 3, title: '완료', state: 'closed', state_reason: 'completed' },
      { number: -1, title: '잘못된 값', state: 'open' }, null,
    ]), { headers: { link: '<https://api.github.com/next>; rel="next"' } })
  } })
  assert.deepEqual(result.issues.map(issue => issue.number), [1, 3])
  assert.equal(result.partial, true)
})

test('rate limits, missing repositories, malformed responses and network failures do not become zero reports', async () => {
  for (const status of [403, 429, 404, 500]) await assert.rejects(fetchReportIssues(project.repository, { fetcher: async () => new Response('{}', { status }) }))
  await assert.rejects(fetchReportIssues(project.repository, { fetcher: async () => new Response('{}') }))
  await assert.rejects(fetchReportIssues(project.repository, { fetcher: async () => { throw new Error('offline') } }))
})
