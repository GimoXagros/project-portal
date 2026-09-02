import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isISODate, latestDate, sortUpdates } from '../../src/utils/dates.js'
import { repositoryParts, releaseIdentity, downloadItems } from '../release-utils.mjs'
import { fetchRelease, verifyProject } from '../verify-releases.mjs'

const project = { id: 'test', repository: 'https://github.com/owner/repo', version: 'v1.0.0', releaseUrl: 'https://github.com/owner/repo/releases/tag/v1.0.0', releaseDate: '2026-09-01', downloads: [{ filename: 'release.zip', size: '42 bytes', sha256: 'a'.repeat(64), url: 'https://github.com/owner/repo/releases/download/v1.0.0/release.zip' }] }
const release = { tag_name: project.version, html_url: project.releaseUrl, published_at: '2026-09-01T23:30:00Z', draft: false, prerelease: false, assets: [{ name: 'release.zip', size: 42, browser_download_url: project.downloads[0].url, digest: 'sha256:' + 'A'.repeat(64) }] }
const fetcher = (data = release) => async () => new Response(JSON.stringify(data), { status: 200 })

test('calendar dates are strict and timezone independent', () => {
  for (const value of ['2024-02-29', '2000-02-29', '2026-09-01']) assert.equal(isISODate(value), true)
  for (const value of ['', undefined, '2026-2-01', '2026-02-29', '1900-02-29', '2026-04-31', '2026-13-01', '2026-00-01']) assert.equal(isISODate(value), false)
  assert.equal(latestDate(['2026-08-29', '', 'invalid', '2026-09-01', '2026-08-31']), '2026-09-01')
  assert.equal(latestDate([]), '')
})
test('date sorting is independent of input order and does not mutate data', () => {
  const entries = [{ date: '2026-08-29', id: 'b' }, { date: '2026-09-01', id: 'a' }, { date: 'bad' }]
  assert.deepEqual(sortUpdates(entries), sortUpdates([...entries].reverse()))
  assert.equal(entries[0].id, 'b')
  assert.equal(sortUpdates(entries)[0].date, '2026-09-01')
})
test('repository and tag reject unsafe or ambiguous identities', () => {
  assert.deepEqual(repositoryParts('https://github.com/owner/repo.git'), { owner: 'owner', repo: 'repo' })
  for (const url of ['https://evil.test/owner/repo', 'https://github.com/owner/repo/issues', 'https://user@github.com/owner/repo', 'https://github.com/owner/repo?x=1']) assert.throws(() => repositoryParts(url))
  assert.throws(() => releaseIdentity({ ...project, version: 'latest' }))
  assert.equal(downloadItems({ downloads: [{ label: 'parts', parts: project.downloads }] }).length, 1)
})
test('stable release metadata and case-insensitive digest match', async () => {
  assert.deepEqual((await verifyProject(project, { fetcher: fetcher() })).errors, [])
})
test('digest unavailable is explicit, but malformed local SHA still fails', async () => {
  const data = structuredClone(release); delete data.assets[0].digest
  const result = await verifyProject(project, { fetcher: fetcher(data) })
  assert.equal(result.errors.length, 0); assert.match(result.notices[0], /SHA 원격 비교를 생략함/)
  const bad = structuredClone(project); bad.downloads[0].sha256 = 'bad'
  assert.match((await verifyProject(bad, { fetcher: fetcher(data) })).errors.join(), /INVALID_SHA/)
})
test('size, URL, digest, date and public release failures are distinct', async () => {
  const bad = structuredClone(release)
  bad.assets[0].size = 43; bad.assets[0].digest = 'sha256:' + 'b'.repeat(64); bad.assets[0].browser_download_url = 'https://example.org/wrong'
  bad.published_at = '2026-09-02T00:00:00Z'; bad.draft = true; bad.prerelease = true
  const { errors } = await verifyProject(project, { fetcher: fetcher(bad) })
  for (const code of ['SIZE_MISMATCH', 'DIGEST_MISMATCH', 'URL_MISMATCH', 'DATE_MISMATCH', 'NOT_PUBLIC_RELEASE', 'NOT_STABLE_RELEASE']) assert.match(errors.join(), new RegExp(code))
  assert.match((await verifyProject(project, { fetcher: fetcher({ ...release, assets: [] }) })).errors.join(), /ASSET_NOT_FOUND/)
})
test('missing release and rate limits are not swallowed', async () => {
  await assert.rejects(fetchRelease('https://api.github.com/test', null, async () => new Response('', { status: 404 })), /RELEASE_NOT_FOUND/)
  await assert.rejects(fetchRelease('https://api.github.com/test', null, async () => new Response('', { status: 403, headers: { 'x-ratelimit-remaining': '0' } })), /RATE_LIMIT/)
})
test('optional token and User-Agent are sent only as headers', async () => {
  let options
  await fetchRelease('https://api.github.com/test', 'test-only-token', async (_url, value) => { options = value; return new Response('{}') })
  assert.equal(options.headers.Authorization, 'Bearer test-only-token')
  assert.equal(options.headers['User-Agent'], 'project-portal-release-verifier')
})
test('temporary server and transport errors get bounded retries', async () => {
  let calls = 0
  await fetchRelease('https://api.github.com/test', null, async () => { calls++; if (calls === 1) throw new Error('offline'); if (calls === 2) return new Response('', { status: 503 }); return new Response('{}') })
  assert.equal(calls, 3)
})
