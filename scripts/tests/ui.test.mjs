import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

// Vite compiles the real JSX. No duplicate hand-written component fixtures.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
after(() => server.close())
const render = async (name, props) => {
  const { default: Component } = await server.ssrLoadModule(`/src/components/${name}.jsx`)
  return renderToStaticMarkup(createElement(Component, props))
}
test('empty catalog renders safely', async () => {
  assert.match(await render('ProjectGrid', { projects: [] }), /아직 공개된 프로젝트가 없습니다/)
  assert.equal(await render('Timeline', { projects: [], updates: [] }), '')
})
test('Hero date does not depend on project order or timezone', async () => {
  const site = { description: 'test' }
  const projects = [{ lastUpdated: '2026-08-29' }, { lastUpdated: '2026-09-01' }, { lastUpdated: 'invalid' }]
  const html = await render('Hero', { site, projects })
  assert.match(html, /최근 업데이트<\/dt><dd>2026-09-01/)
  assert.equal(html, await render('Hero', { site, projects: [...projects].reverse() }))
  assert.match(await render('Hero', { site, projects: [] }), /최근 업데이트<\/dt><dd>—/)
})
test('missing downloads, gallery and hashes do not expose empty controls', async () => {
  const html = await render('DownloadSection', { project: { downloadEnabled: false, downloads: [] } })
  assert.match(html, /disabled=""/); assert.match(html, /배포 준비 중/); assert.doesNotMatch(html, /href=/)
  const missingURL = await render('DownloadSection', { project: { downloadEnabled: true, downloads: [{ label: 'test', url: '' }] } })
  assert.match(missingURL, /aria-disabled="true"/); assert.doesNotMatch(missingURL, /href=/)
  assert.equal(await render('ScreenshotGallery', { screenshots: [] }), '')
  assert.equal(await render('HashInfo', { project: {} }), '')
})
test('reduced motion and progressive visibility rules remain explicit', () => {
  const css = readFileSync(new URL('../../src/styles/motion.css', import.meta.url), 'utf8')
  const reduce = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(reduce, /animation: none !important/)
  assert.match(reduce, /transition: none !important/)
  assert.match(reduce, /opacity: 1 !important/)
  assert.match(reduce, /scroll-behavior: auto/)
  assert.doesNotMatch(css, /transition:\s*all|will-change:/)
  const hook = readFileSync(new URL('../../src/hooks/useReveal.js', import.meta.url), 'utf8')
  assert.match(hook, /!window.IntersectionObserver \|\| media.matches/)
  assert.match(hook, /observer\.unobserve\(target\)/)
})

test('current projects derive the Hero date from the latest release regardless of array order', async () => {
  const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))
  const html = await render('Hero', { site: { description: 'test' }, projects })
  assert.match(html, /최근 업데이트<\/dt><dd>2026-09-12/)
  assert.equal(html, await render('Hero', { site: { description: 'test' }, projects: [...projects].reverse() }))
  assert.match(html, /현재 배포 중 · 5 PROJECTS/)
  assert.equal(projects.length, 5)
})

test('all projects expose their full public release history from the first recorded point', async () => {
  const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))
  const expected = {
    gameyob: ['v0.5.10', 'v0.5.9-ko', 'v0.5.8-ko', 'v0.5.7-ko', 'v0.5.5-ko', 'v0.5.3-ko', 'v0.5.2-ko.1'],
    gbarunner3: ['custom-v0.1.3', 'custom-v0.1.3-rc2', 'custom-v0.1.3-rc1', 'custom-v0.1.2', 'custom-v0.1.1', 'custom-v0.1.0-rc5', 'custom-v0.1.0-rc1'],
    nitroswan: ['v0.7.7-custom.r8', 'v0.7.7-custom.r7', 'v0.7.7-custom.r6', 'v0.7.7-custom.r5', 'v0.7.7-custom.r4', 'v0.7.7-custom.r3', 'v0.7.7-custom.r2', 'v0.7.7-custom', 'v0.7.7'],
    'gba-narikiri3-kor': ['v1.1a'],
    'narikiri2-save-compat': ['v0.9d', 'v0.9c', 'v0.9b', 'v0.9a', 'v0.9', 'v0.5'],
  }
  for (const [id, versions] of Object.entries(expected)) {
    const changelog = JSON.parse(readFileSync(new URL(`../../src/data/changelogs/${id}.json`, import.meta.url), 'utf8'))
    assert.deepEqual(changelog.entries.map((entry) => entry.version), versions)
  }
  const project = projects.find((item) => item.id === 'nitroswan')
  const changelog = JSON.parse(readFileSync(new URL('../../src/data/changelogs/nitroswan.json', import.meta.url), 'utf8'))
  const html = await render('ProjectDetail', { project, changelog })
  assert.match(html, /캐릭터 모션 깨짐의 완전한 해결을 의미하지 않습니다/)
  assert.match(html, /아직 수행되지 않았습니다/)
  for (const download of project.downloads) {
    assert.match(download.url, /custom\.r8\//)
    assert.ok(html.includes(download.url))
    assert.ok(html.includes(download.sha256))
  }
  const timeline = await render('UpdateTimeline', { changelog })
  assert.ok(timeline.indexOf('v0.7.7-custom.r8') < timeline.indexOf('v0.7.7-custom.r7'))
  assert.ok(timeline.indexOf('v0.7.7-custom.r7') < timeline.indexOf('v0.7.7-custom.r6'))
})

test('Narikiri renders v0.9d as the primary public beta with all selectable patch versions', async () => {
  const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))
  const project = projects.find((item) => item.id === 'narikiri2-save-compat')
  const html = await render('ProjectDetail', { project })
  assert.equal(project.type, 'korean-patch')
  assert.equal(project.version, 'v0.9d')
  assert.equal(project.releasePolicy, 'latest-prerelease')
  assert.ok(html.includes('일본어 원본에 직접 적용'))
  assert.notDeepEqual(project.webPatcher.versions[0].source, project.webPatcher.versions[1].source)
  assert.notEqual(project.webPatcher.versions[0].output.sha256, project.webPatcher.versions[1].output.sha256)
  for (const text of ['테일즈 오브 더 월드 나리키리 던전2', 'AN9J', '공개 검증판 v0.9d', 'logo-20260913.png', project.downloads[0].url]) assert.ok(html.includes(text))
  for (const download of project.downloads) {
    assert.ok(html.includes(download.url))
    assert.ok(html.includes(download.sha256))
  }
  assert.match(html, /width="1254" height="1254"/)
  assert.doesNotMatch(html, /href="[^"]+\.(gba|sav|ips)"/)
  assert.match(html, /PUBLIC BETA/)
  for (const text of ['브라우저에서 바로 패치', 'ROM은 업로드되지 않습니다', 'RomPatcher.js', 'v3.2.1', 'ROM 선택', '패치 적용', '검증 후 활성화']) assert.ok(html.includes(text))
  assert.match(html, /<label for="patch-version">/)
  assert.match(html, /<select id="patch-version">/)
  assert.match(html, /<option value="v0\.9d" selected="">v0\.9d \(최신\)<\/option>/)
  assert.match(html, /<option value="v0\.9b">v0\.9b<\/option>/)
  assert.match(html, /<option value="v0\.9a">v0\.9a<\/option>/)
  assert.match(html, /<option value="v0\.9">v0\.9<\/option>/)
  assert.match(html, /type="file"/)
  assert.match(html, /disabled=""/)
  assert.ok(html.includes(project.webPatcher.versions[0].output.filename))
  assert.doesNotMatch(html, /download="NARIKIRI2_AN9J_K_DALMOORI_v0\.9c\.gba"/)
})

const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))
const changelogFor = (id) => JSON.parse(readFileSync(new URL(`../../src/data/changelogs/${id}.json`, import.meta.url), 'utf8'))
const occurrences = (html, text) => html.split(text).length - 1
const escape = (text) => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;')

test('home renders each project once including featured projects', async () => {
  const priorWindow = globalThis.window
  const priorMatchMedia = globalThis.matchMedia
  globalThis.matchMedia = () => ({ matches: false })
  globalThis.window = { location: { hash: '' } }
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const html = renderToStaticMarkup(createElement(App))
    for (const project of projects) assert.equal(occurrences(html, `data-project-id="${project.id}"`), 1)
    assert.equal(occurrences(html, 'class="featured-ribbon"'), projects.filter(p=>p.featured).length)
    assert.match(html, /프로젝트 검색/)
    assert.match(html, /종류 필터/)
    assert.match(html, /모든 플랫폼/)
    assert.match(html, /aria-live="polite"/)
    assert.doesNotMatch(html, /featured-grid|featured-section/)
  } finally { globalThis.window = priorWindow; globalThis.matchMedia = priorMatchMedia }
})

test('catalog orders featured first, dates descending and keeps ties stable', async () => {
  const fixtures = ['a','b','c','d'].map((id, i) => ({ ...projects[0], id, featured: i > 0, lastUpdated: i===3 ? '2026-09-08' : '2026-09-05' }))
  const html = await render('ProjectGrid', { projects: fixtures })
  assert.deepEqual([...html.matchAll(/data-project-id="([^"]+)"/g)].map(m=>m[1]), ['d','b','c','a'])
  assert.deepEqual(fixtures.map(p=>p.id), ['a','b','c','d'])
})

test('filters retain search, type, platform, reset and native disclosure', async () => {
  const html = await render('ProjectFilters', { query:'test', type:'emulator', platform:'all', platforms:['DS','DSi'], resultCount:2 })
  assert.match(html, /<details class="filter-panel">/)
  assert.match(html, /필터 · 적용 중/)
  assert.match(html, /aria-pressed="true"/)
  assert.match(html, /필터 초기화/)
  assert.match(html, /2개 표시/)
  assert.match(html, /value="DSi"/)
})

test('cards use subtitles and summarize platforms without losing names', async () => {
  const project = {...projects[0], platform:['DS','DSi','3DS'], subtitle:'짧은 요약', description:'긴 릴리스 설명'}
  const html = await render('ProjectCard', {project})
  assert.match(html,/짧은 요약/); assert.doesNotMatch(html,/긴 릴리스 설명/)
  assert.match(html,/title="DS, DSi, 3DS"/); assert.match(html,/>\+1</)
})

test('detail has one copy of notes, real jump targets and one compact update', async () => {
  for (const project of projects) {
    const changelog = changelogFor(project.id)
    const html = await render('ProjectDetail', {project, changelog})
    for (const note of project.notes) assert.equal(occurrences(html, escape(note)),1, `${project.id}: ${note}`)
    assert.equal(occurrences(html, 'class="update-marker"'),1)
    assert.match(html,/전체 업데이트 기록 보기/)
    assert.match(html,/페이지 내 빠른 이동/)
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])
    assert.equal(new Set(ids).size,ids.length)
    for (const hash of project.downloads.map(d=>d.sha256)) assert.ok(html.includes(hash))
    assert.match(html,/SHA-256 복사/)
    assert.doesNotMatch(html,/warning-aside/)
  }
})

test('updates index selects each project once; selected page preserves full history', async () => {
  const html = await render('UpdatesPage',{projects})
  for(const project of projects) {
    assert.equal(occurrences(html, `href="#/updates/${project.id}"`),1)
    const selected = await render('UpdatesPage',{projects,projectId:project.id})
    const changelog = changelogFor(project.id)
    assert.equal(occurrences(selected,'class="update-marker"'),changelog.entries.length)
    for(const entry of changelog.entries) assert.ok(selected.includes(escape(entry.summary)))
    assert.match(selected,/aria-current="page"/)
    assert.doesNotMatch(selected,/selected-update-cover|<img/)
  }
  assert.doesNotMatch(html,/update-project-tabs/)
})

test('compact timeline limits entries without reordering same-date versions', async () => {
  const changelog = changelogFor('narikiri2-save-compat')
  const html = await render('UpdateTimeline',{changelog,compact:true,limit:1})
  assert.equal(occurrences(html,'class="update-marker"'),1)
  assert.ok(html.includes(changelog.entries[0].version))
  assert.ok(!html.includes(`<code>${changelog.entries[1].version}</code>`))
  const all = await render('UpdateTimeline',{changelog})
  assert.equal(occurrences(all,'class="update-marker"'),changelog.entries.length)
})

test('home feed caps latest projects at four with no repeated logos', async () => {
  const fixtures = Array.from({length:6},(_,i)=>({...projects[0],id:`project-${i}`}))
  const updates = fixtures.map((p,i)=>({...changelogFor('gameyob').entries[0],projectId:p.id,date:`2026-09-0${i+1}`}))
  const html = await render('Timeline',{projects:fixtures,updates:[...updates,updates[0]]})
  assert.equal(occurrences(html,'<li '),4)
  assert.doesNotMatch(html,/<img|latest-update-card/)
  assert.ok(html.indexOf('2026-09-06') < html.indexOf('2026-09-05'))
})

test('unknown project and update routes retain 404', async () => {
  assert.match(await render('ProjectDetail',{project:null}),/404/)
  assert.match(await render('UpdatesPage',{projects,projectId:'unknown'}),/404/)
})
