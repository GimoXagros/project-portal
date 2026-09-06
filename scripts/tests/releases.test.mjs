import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { isISODate, latestDate, sortUpdates } from '../../src/utils/dates.js'
import { repositoryParts, releaseIdentity, downloadItems } from '../release-utils.mjs'
import { fetchRelease, verifyProject } from '../verify-releases.mjs'
import { validateData } from '../validate-data.mjs'

const project = { id: 'test', repository: 'https://github.com/owner/repo', version: 'v1.0.0', releaseUrl: 'https://github.com/owner/repo/releases/tag/v1.0.0', releaseDate: '2026-09-01', downloads: [{ filename: 'release.zip', size: '42 bytes', sha256: 'a'.repeat(64), url: 'https://github.com/owner/repo/releases/download/v1.0.0/release.zip' }] }
const release = { tag_name: project.version, html_url: project.releaseUrl, published_at: '2026-09-01T23:30:00Z', draft: false, prerelease: false, assets: [{ name: 'release.zip', size: 42, browser_download_url: project.downloads[0].url, digest: 'sha256:' + 'A'.repeat(64) }] }
const previewProject = {
  ...project,
  prerelease: {
    title: 'v1.1.0-rc1 preview', version: 'v1.1.0-rc1', releasePolicy: 'latest-prerelease', releaseDate: '2026-09-02',
    releaseUrl: 'https://github.com/owner/repo/releases/tag/v1.1.0-rc1', summary: 'Preview summary', notes: ['Preview caution'], downloadEnabled: true,
    downloads: [{ filename: 'preview.zip', size: '84 bytes', sha256: 'b'.repeat(64), url: 'https://github.com/owner/repo/releases/download/v1.1.0-rc1/preview.zip' }],
  },
}
const prerelease = { tag_name: 'v1.1.0-rc1', html_url: previewProject.prerelease.releaseUrl, published_at: '2026-09-02T12:00:00Z', draft: false, prerelease: true, assets: [{ name: 'preview.zip', size: 84, browser_download_url: previewProject.prerelease.downloads[0].url, digest: 'sha256:' + 'B'.repeat(64) }] }
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
test('stable and latest prerelease channels are verified independently', async () => {
  const urls = []
  const result = await verifyProject(previewProject, { fetcher: async (url) => {
    urls.push(url)
    return new Response(JSON.stringify(url.endsWith('/latest') ? release : [{ ...prerelease, tag_name: 'v1.0.1-rc1', published_at: '2026-08-31T12:00:00Z' }, prerelease]))
  } })
  assert.deepEqual(result.errors, [])
  assert.deepEqual(urls, ['https://api.github.com/repos/owner/repo/releases/latest', 'https://api.github.com/repos/owner/repo/releases?per_page=100'])
})
test('latest prerelease drift and channel mismatches fail explicitly', async () => {
  const newer = { ...prerelease, tag_name: 'v1.2.0-rc1' }
  const drift = await verifyProject(previewProject, { fetcher: async (url) => new Response(JSON.stringify(url.endsWith('/latest') ? release : [newer])) })
  assert.match(drift.errors.join(), /LATEST_PRERELEASE_DRIFT/)
  const stableFlag = await verifyProject(previewProject, { fetcher: async (url) => new Response(JSON.stringify(url.endsWith('/latest') ? release : [{ ...prerelease, prerelease: false }])) })
  assert.match(stableFlag.errors.join(), /RELEASE_NOT_FOUND/)
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
  await fetchRelease('https://api.github.com/test', null, async () => { calls++; if (calls === 1) throw new Error('offline'); if (calls === 2) return new Response('', { status: 503 }); return new Response('{}') }, { wait: async () => {} })
  assert.equal(calls, 3)
})

test('default and explicit latest-stable policies query latest once and do not mutate data', async () => {
  for (const current of [project, { ...project, releasePolicy: 'latest-stable' }]) {
    const before = structuredClone(current)
    const urls = []
    const result = await verifyProject(current, { fetcher: async (url) => { urls.push(url); return new Response(JSON.stringify(release)) } })
    assert.deepEqual(result.errors, [])
    assert.deepEqual(urls, ['https://api.github.com/repos/owner/repo/releases/latest'])
    assert.deepEqual(current, before)
  }
})

test('a newer latest release reports drift and still checks the latest metadata', async () => {
  const newer = structuredClone(release)
  newer.tag_name = 'v1.1.0'
  newer.html_url = newer.html_url.replace('v1.0.0', 'v1.1.0')
  newer.published_at = '2026-09-02T01:00:00Z'
  newer.assets[0].size = 43
  newer.assets[0].digest = 'sha256:' + 'b'.repeat(64)
  const { errors } = await verifyProject(project, { fetcher: fetcher(newer) })
  assert.ok(errors.includes('LATEST_RELEASE_DRIFT: configured="v1.0.0" latest="v1.1.0"'))
  for (const code of ['URL_MISMATCH', 'DATE_MISMATCH', 'SIZE_MISMATCH', 'DIGEST_MISMATCH']) assert.match(errors.join(), new RegExp(code))
})

test('latest release asset size and digest mismatches independently fail', async () => {
  for (const [field, value, code] of [['size', 43, 'SIZE_MISMATCH'], ['digest', 'sha256:' + 'b'.repeat(64), 'DIGEST_MISMATCH']]) {
    const bad = structuredClone(release)
    bad.assets[0][field] = value
    assert.match((await verifyProject(project, { fetcher: fetcher(bad) })).errors.join(), new RegExp(code))
  }
})

test('pinned validates only the specified tag even when a newer release exists', async () => {
  const urls = []
  const result = await verifyProject({ ...project, releasePolicy: 'pinned', pinReason: '실기 회귀 검증을 기다리는 중' }, {
    fetcher: async (url) => {
      urls.push(url)
      return new Response(JSON.stringify(url.endsWith('/latest') ? { ...release, tag_name: 'v2.0.0' } : release))
    },
  })
  assert.deepEqual(result.errors, [])
  assert.deepEqual(urls, ['https://api.github.com/repos/owner/repo/releases/tags/v1.0.0'])
})

test('complete static validator rejects invalid policies and missing or misplaced pin reasons', () => {
  const data = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))
  assert.deepEqual(validateData(data).errors, [])
  for (const policy of [
    { releasePolicy: 'pinned' }, { releasePolicy: 'pinned', pinReason: '' },
    { releasePolicy: 'pinned', pinReason: '   ' }, { releasePolicy: 'pinned', pinReason: 1 },
    { releasePolicy: 'invalid' }, { releasePolicy: null }, { releasePolicy: 'latest-stable', pinReason: 'unneeded' },
  ]) {
    const bad = structuredClone(data); Object.assign(bad[0], policy)
    assert.match(validateData(bad).errors.join(), /releasePolicy\/pinReason/)
  }
  const good = structuredClone(data)
  Object.assign(good[0], { releasePolicy: 'pinned', pinReason: 'Hardware testing pending' })
  assert.deepEqual(validateData(good).errors, [])
  const previewIndex = data.findIndex((item) => item.prerelease)
  const badPreview = structuredClone(data)
  badPreview[previewIndex].prerelease.releasePolicy = 'latest-stable'
  assert.match(validateData(badPreview).errors.join(), /prerelease\.releasePolicy/)

  const malformedPreview = structuredClone(data)
  malformedPreview[previewIndex].prerelease = []
  assert.match(validateData(malformedPreview).errors.join(), /prerelease.*object/)

  const patcherIndex = data.findIndex((item) => item.prerelease?.webPatcher)
  const badPatcher = structuredClone(data)
  badPatcher[patcherIndex].prerelease.webPatcher.engineVersion = 'latest'
  badPatcher[patcherIndex].prerelease.webPatcher.patch.sha256 = '0'.repeat(64)
  assert.match(validateData(badPatcher).errors.join(), /webPatcher\.engineVersion/)
  assert.match(validateData(badPatcher).errors.join(), /webPatcher\.patch\.sha256/)
})

test('invalid policy fails before any network request', async () => {
  const result = await verifyProject({ ...project, releasePolicy: 'pinned' }, { fetcher: async () => { assert.fail('must not request') } })
  assert.match(result.errors.join(), /INVALID_POLICY/)
})

test('latest 404 and rate limits fail without fallback to the configured tag', async () => {
  for (const [status, headers, code] of [[404, {}, 'RELEASE_NOT_FOUND'], [429, {}, 'RATE_LIMIT'], [403, { 'x-ratelimit-remaining': '0' }, 'RATE_LIMIT'], [403, { 'retry-after': '60' }, 'RATE_LIMIT'], [403, {}, 'API_ACCESS']]) {
    const urls = []
    const result = await verifyProject(project, { fetcher: async (url) => { urls.push(url); return new Response('', { status, headers }) } })
    assert.match(result.errors.join(), new RegExp(code))
    assert.deepEqual(urls, ['https://api.github.com/repos/owner/repo/releases/latest'])
  }
})

test('draft and prerelease responses never count as stable latest releases', async () => {
  for (const [field, code] of [['draft', 'NOT_PUBLIC_RELEASE'], ['prerelease', 'NOT_STABLE_RELEASE']]) {
    assert.match((await verifyProject(project, { fetcher: fetcher({ ...release, [field]: true }) })).errors.join(), new RegExp(code))
  }
})

test('timeouts retry successfully, including a timeout while reading the body', async () => {
  let calls = 0
  const waits = []
  const result = await verifyProject(project, {
    wait: async (ms) => { waits.push(ms) },
    fetcher: async (_url, { signal }) => {
      assert.ok(signal instanceof AbortSignal)
      calls++
      if (calls === 1) throw new DOMException('test timeout', 'TimeoutError')
      if (calls === 2) return { ok: true, json: async () => { throw new DOMException('body timeout', 'AbortError') } }
      return new Response(JSON.stringify(release))
    },
  })
  assert.deepEqual(result.errors, [])
  assert.equal(calls, 3)
  assert.deepEqual(waits, [500, 1000])
})

test('exhausted timeout, network and server retries are distinct and never expose tokens', async () => {
  for (const code of ['TIMEOUT', 'NETWORK', 'API_SERVER', 'INVALID_RESPONSE']) {
    let calls = 0
    const result = await verifyProject(project, {
      token: 'secret-test-token', wait: async () => {},
      fetcher: async () => {
        calls++
        if (code === 'TIMEOUT') throw new DOMException('secret-test-token', 'TimeoutError')
        if (code === 'NETWORK') throw new Error('secret-test-token')
        return new Response(code === 'INVALID_RESPONSE' ? 'bad json' : '', { status: code === 'API_SERVER' ? 503 : 200 })
      },
    })
    assert.equal(calls, 3)
    assert.match(result.errors.join(), new RegExp(`^${code}:`))
    assert.doesNotMatch(result.errors.join(), /secret-test-token|LATEST_RELEASE_DRIFT/)
  }
})

test('malformed release metadata is an API response failure rather than a crash', async () => {
  for (const bad of [{ ...release, assets: {} }, { ...release, published_at: null }, { ...release, tag_name: null }]) {
    assert.match((await verifyProject(project, { fetcher: fetcher(bad) })).errors.join(), /INVALID_RESPONSE/)
  }
})
