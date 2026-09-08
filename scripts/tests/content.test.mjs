import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { validateData } from '../validate-data.mjs'
const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json',import.meta.url),'utf8'))
test('duplicate validator normalizes only exact cross-field sentences',()=>{
  const data = structuredClone(projects)
  data[0].features.push('  Exact   Sentence.  ')
  data[0].scope.push('exact sentence')
  const errors = validateData(data).errors
  assert.ok(errors.some(e=>e.includes('[gameyob]') && e.includes('features') && e.includes('scope') && e.includes('exact sentence')))
  data[0].scope.pop()
  data[0].scope.push('exact sentence with a unique fact')
  data[0].features.push('exact sentence')
  assert.deepEqual(validateData(data).errors,[])
})
