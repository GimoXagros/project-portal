import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
after(() => server.close())
const render = async (name, props) => {
  const { default: Component } = await server.ssrLoadModule(`/src/components/${name}.jsx`)
  return renderToStaticMarkup(createElement(Component, props))
}
const project = {
  id: 'progress-fixture', title: '테스트 한글패치', type: 'korean-patch',
  repository: 'https://github.com/example/patch',
  progress: {
    updatedAt: '2026-09-29', summary: '번역과 검수를 구분합니다.',
    stages: [
      { id: 'translation', label: '텍스트 번역', percent: 100, status: 'complete', detail: '공개 번역 범위입니다.', sourceUrl: 'https://github.com/example/patch/blob/main/README.md' },
      { id: 'review', label: '실기 검수', percent: null, status: 'in-progress', detail: '게임 전체 검수율은 미공개입니다.' },
      { id: 'graphics', label: '그래픽', percent: 0, status: 'not-started' },
    ],
  },
}

test('progress shows compact stage labels and measured percentages without explanatory content', async () => {
  const html = await render('ProjectProgress', { project })
  assert.equal((html.match(/role="progressbar"/g) || []).length, 2)
  assert.match(html, /aria-label="테스트 한글패치 · 텍스트 번역"/)
  assert.match(html, /aria-valuenow="100"/)
  assert.match(html, /aria-valuenow="0"/)
  assert.match(html, /aria-label="진행률 미공개" title="진행률 미공개">—<\/span>/)
  assert.match(html, /progress-track-unknown" aria-hidden="true"/)
  assert.doesNotMatch(html, /진행 중|dateTime=|근거 보기|확인 기준|progress-stage-status|progress-footnote/)
  assert.ok(!html.includes(project.progress.stages[0].sourceUrl))
  assert.ok(!html.includes(project.progress.summary))
  for (const stage of project.progress.stages) {
    assert.ok(html.includes(stage.label))
    if (stage.detail) assert.ok(!html.includes(stage.detail))
  }
  assert.doesNotMatch(html, /33\.3|전체 진행률/)
})

test('compact progress preserves stage context without long descriptions or evidence links', async () => {
  const html = await render('ProjectCard', { project })
  for (const stage of project.progress.stages) assert.ok(html.includes(stage.label))
  assert.match(html, /title="진행률 미공개">—<\/span>/)
  assert.doesNotMatch(html, /공개 번역 범위입니다|근거 보기|번역과 검수를 구분합니다|progress-stage-status|progress-footnote/)
})

test('progress hides for unrelated projects and treats absent or invalid percentages as unknown', async () => {
  assert.equal(await render('ProjectProgress', { project: { ...project, type: 'tool' } }), '')
  assert.equal(await render('ProjectProgress', { project: { ...project, progress: undefined } }), '')
  assert.equal(await render('ProjectProgress', { project: { ...project, progress: { stages: [] } } }), '')
  for (const percent of [null, undefined, -1, 101, '50', NaN, Infinity]) {
    const html = await render('ProjectProgress', { project: { ...project, progress: { stages: [{ id: 'test', label: '검수', status: 'unverified', percent }] } } })
    assert.doesNotMatch(html, /role="progressbar"|aria-valuenow/)
    assert.match(html, /aria-label="진행률 미공개" title="진행률 미공개">—<\/span>/)
    assert.match(html, /progress-track-unknown" aria-hidden="true"/)
    assert.doesNotMatch(html, /확인 필요|>0%<|>100%</)
  }
})

test('patch detail provides a dedicated progress section and jump control', async () => {
  const html = await render('ProjectDetail', { project })
  assert.match(html, /id="translation-progress"/)
  assert.match(html, />진행 현황<\/button>/)
  const unrelated = await render('ProjectDetail', { project: { ...project, type: 'tool' } })
  assert.doesNotMatch(unrelated, /id="translation-progress"|>진행 현황<\/button>/)
})
