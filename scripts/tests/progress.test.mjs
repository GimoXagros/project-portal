import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateProgress } from '../progress-validation.mjs'

const fixture = () => ({ updatedAt: '2026-09-29', summary: '공개 근거 기준', stages: [
  { id: 'translation', label: '번역', percent: 100, status: 'complete', detail: '확인 대상 10/10', sourceUrl: 'https://example.com/evidence' },
  { id: 'playtest', label: '플레이 검증', percent: null, status: 'unverified', detail: '전편 검증 미확인', sourceUrl: 'https://example.com/evidence' },
] })
test('progress accepts sourced completion and unknown percentages independently', () => {
  assert.deepEqual(validateProgress(fixture()), [])
})
test('progress rejects invented defaults, missing evidence and contradictory completion', () => {
  for (const mutate of [
    p => { p.stages[0].percent = 101 },
    p => { p.stages[0].percent = '100' },
    p => { p.stages[0].percent = 50 },
    p => { p.stages[1].percent = 0 },
    p => { delete p.stages[1].percent },
    p => { p.stages[0].sourceUrl = 'javascript:alert(1)' },
    p => { p.stages[0].detail = '' },
    p => { p.stages.push(p.stages[0]) },
    p => { p.updatedAt = '2026-02-30' },
    p => { p.stages = [] },
  ]) {
    const data = fixture(); mutate(data)
    assert.ok(validateProgress(data).length > 0)
  }
})
