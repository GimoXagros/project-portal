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
