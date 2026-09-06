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
test('empty projects and featured collections render safely', async () => {
  assert.match(await render('ProjectGrid', { projects: [] }), /아직 공개된 프로젝트가 없습니다/)
  assert.equal(await render('FeaturedProjects', { projects: [] }), '')
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
  assert.match(html, /최근 업데이트<\/dt><dd>2026-09-06/)
  assert.equal(html, await render('Hero', { site: { description: 'test' }, projects: [...projects].reverse() }))
  assert.match(html, /현재 배포 중 · 4 PROJECTS/)
  assert.equal(projects.length, 4)
})

test('NitroSwan shows r8 downloads, retained history and unverified limitations', async () => {
  const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))
  const project = projects.find((item) => item.id === 'nitroswan')
  const changelog = JSON.parse(readFileSync(new URL('../../src/data/changelogs/nitroswan.json', import.meta.url), 'utf8'))
  assert.deepEqual(changelog.entries.map((entry) => entry.version), ['v0.7.7-custom.r8', 'v0.7.7-custom.r7', 'v0.7.7-custom.r6'])
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

test('Narikiri renders stable and prerelease channels with supplied art and cautions', async () => {
  const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))
  const project = projects.find((item) => item.id === 'narikiri2-save-compat')
  const html = await render('ProjectDetail', { project })
  assert.equal(project.type, 'tool')
  for (const text of ['정식 v0.5', '32 KiB', '소스 전용', 'logo.png', project.downloads[0].url, project.prerelease.version, project.prerelease.summary]) assert.ok(html.includes(text))
  for (const download of project.prerelease.downloads) {
    assert.ok(html.includes(download.url))
    assert.ok(html.includes(download.sha256))
  }
  assert.match(html, /width="1254" height="1254"/)
  assert.doesNotMatch(html, /href="[^"]+\.(gba|sav|ips)"/)
  assert.match(html, /PRE-RELEASE/)
  for (const text of ['브라우저에서 바로 패치', 'ROM은 업로드되지 않습니다', 'RomPatcher.js', 'v3.2.1', 'ROM 선택', '패치 적용', '검증 후 활성화']) assert.ok(html.includes(text))
  assert.match(html, /<label for="patch-version">/)
  assert.match(html, /<select id="patch-version">/)
  assert.match(html, /<option value="v0\.9a" selected="">v0\.9a \(최신\)<\/option>/)
  assert.match(html, /<option value="v0\.9">v0\.9<\/option>/)
  assert.match(html, /type="file"/)
  assert.match(html, /disabled=""/)
  assert.ok(html.includes(project.prerelease.webPatcher.versions[0].output.filename))
  assert.doesNotMatch(html, /download="NARIKIRI2_AN9J_K_DALMOORI_v0\.9a\.gba"/)
})
