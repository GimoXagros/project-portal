import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { validateData } from '../validate-data.mjs'
import { verifyProject } from '../verify-releases.mjs'

const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))

test('future Korean patches cannot omit the patcher or expose downloads', () => {
  for (const mutate of [
    p => { delete p.webPatcher },
    p => { p.downloadEnabled = true },
    p => { p.downloads = [{ filename: 'patch.bps', url: p.repository + '/releases/download/' + p.version + '/patch.bps' }] },
  ]) {
    const data = structuredClone(projects)
    mutate(data.find(p => p.type === 'korean-patch'))
    assert.ok(validateData(data).errors.some(error => /Korean patches/.test(error)))
  }
})

test('downloadable projects require current version and verified historical asset metadata', () => {
  for (const mutate of [
    p => { delete p.downloadVersions },
    p => { p.downloadVersions = p.downloadVersions.filter(v => v.version !== p.version) },
    p => { p.downloadVersions.at(-1).downloads[0].sha256 = 'bad' },
    p => { p.downloadVersions.at(-1).downloads[0].url = 'https://example.com/file.zip' },
  ]) {
    const data = structuredClone(projects)
    mutate(data.find(p => p.type === 'emulator'))
    assert.ok(validateData(data).errors.some(error => /downloadVersions/.test(error)))
  }
})

test('remote checks include historical selected downloads', async () => {
  const project = projects.find(p => p.id === 'gameyob')
  const calls = []
  const fetcher = async url => {
    calls.push(url)
    const version = url.endsWith('/latest') ? project.version : decodeURIComponent(url.split('/').at(-1))
    const record = project.downloadVersions.find(v => v.version === version)
    return new Response(JSON.stringify({
      tag_name: record.version, html_url: record.releaseUrl, published_at: record.releaseDate + 'T00:00:00Z', draft: false, prerelease: false,
      assets: record.downloads.map(a => ({ name: a.filename, size: Number(a.size.split(' ')[0]), browser_download_url: a.url, digest: 'sha256:' + (version === project.version ? a.sha256 : '0'.repeat(64)) })),
    }))
  }
  const result = await verifyProject(project, { fetcher })
  assert.equal(calls.length, project.downloadVersions.length)
  assert.ok(result.errors.some(error => /DIGEST_MISMATCH/.test(error)))
})
