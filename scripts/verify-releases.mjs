import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { downloadItems, prereleaseRecord, releaseIdentity, releasePolicy } from './release-utils.mjs'

export async function fetchRelease(url, token, fetcher = fetch, { wait = (ms) => new Promise((done) => setTimeout(done, ms)), timeoutMs = 15000 } = {}) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'project-portal-release-verifier', 'X-GitHub-Api-Version': '2022-11-28' }
  if (token) headers.Authorization = `Bearer ${token}`
  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response
    try {
      response = await fetcher(url, { headers, signal: AbortSignal.timeout(timeoutMs) })
      // Keep body consumption within the same request deadline and retry boundary.
      if (response.ok) {
        const data = await response.json()
        if (!data || typeof data !== 'object') throw new SyntaxError('Invalid release response')
        return data
      }
    } catch (error) {
      if (attempt < 2) { await wait(500 * (attempt + 1)); continue }
      const code = ['TimeoutError', 'AbortError'].includes(error.name) ? 'TIMEOUT' : error instanceof SyntaxError ? 'INVALID_RESPONSE' : 'NETWORK'
      // Never include transport errors: they may contain request headers or tokens.
      throw new Error(`${code}: GitHub API 요청 실패 (최대 ${timeoutMs}ms, 3회 시도)`)
    }
    if (response.status === 404) throw new Error('RELEASE_NOT_FOUND: release 없음 또는 접근 불가 (HTTP 404)')
    if (response.status === 429 || (response.status === 403 && (response.headers.get('x-ratelimit-remaining') === '0' || response.headers.has('retry-after')))) throw new Error('RATE_LIMIT: GitHub API rate limit; 잠시 후 재시도하거나 GITHUB_TOKEN을 사용하세요')
    if (response.status >= 500 && attempt < 2) { await wait(500 * (attempt + 1)); continue }
    throw new Error(`${response.status >= 500 ? 'API_SERVER' : 'API_ACCESS'}: GitHub API HTTP ${response.status}`)
  }
}

async function verifyReleaseRecord(record, { expectedPrerelease, token, fetcher, requestOptions }) {
  const errors = [], notices = []
  const compare = (field, actual, expected, code = 'MISMATCH') => {
    if (actual !== expected) errors.push(`${code}: ${field} actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`)
  }
  let identity
  try { identity = releaseIdentity(record) } catch (error) { return { errors: [`INVALID_IDENTITY: repository/tag ${error.message}`], notices } }
  let policy
  try { policy = releasePolicy(record) } catch (error) { return { errors: [`INVALID_POLICY: ${error.message}`], notices } }
  const allowedPolicies = expectedPrerelease ? ['latest-prerelease', 'pinned-prerelease'] : ['latest-stable', 'pinned']
  if (!allowedPolicies.includes(policy)) return { errors: [`INVALID_POLICY: ${expectedPrerelease ? 'prerelease' : 'stable'} channel requires ${allowedPolicies.join(' or ')}`], notices }
  const { owner, repo, tag } = identity
  const endpoint = policy === 'pinned' || policy === 'pinned-prerelease'
    ? `tags/${encodeURIComponent(tag)}`
    : 'latest'
  const apiRoot = `https://api.github.com/repos/${owner}/${repo}/releases`
  const url = policy === 'latest-prerelease' ? `${apiRoot}?per_page=100` : `${apiRoot}/${endpoint}`
  let release
  try { release = await fetchRelease(url, token, fetcher, requestOptions) }
  catch (error) { return { errors: [error.message], notices } }
  if (policy === 'latest-prerelease') {
    if (!Array.isArray(release)) return { errors: ['INVALID_RESPONSE: GitHub prerelease 목록 형식 오류'], notices }
    release = release
      .filter((candidate) => candidate && candidate.draft === false && candidate.prerelease === true && typeof candidate.published_at === 'string')
      .sort((a, b) => b.published_at.localeCompare(a.published_at))[0]
    if (!release) return { errors: ['RELEASE_NOT_FOUND: 공개 prerelease가 없습니다'], notices }
  }
  if (!Array.isArray(release.assets) || typeof release.published_at !== 'string' || typeof release.tag_name !== 'string') return { errors: ['INVALID_RESPONSE: GitHub Release 필수 메타데이터 형식 오류'], notices }
  compare('draft', release.draft, false, 'NOT_PUBLIC_RELEASE')
  compare('prerelease', release.prerelease, expectedPrerelease, expectedPrerelease ? 'NOT_PRERELEASE' : 'NOT_STABLE_RELEASE')
  if (policy === 'latest-stable' && record.version !== release.tag_name) errors.push(`LATEST_RELEASE_DRIFT: configured=${JSON.stringify(record.version)} latest=${JSON.stringify(release.tag_name)}`)
  else if (policy === 'latest-prerelease' && record.version !== release.tag_name) errors.push(`LATEST_PRERELEASE_DRIFT: configured=${JSON.stringify(record.version)} latest=${JSON.stringify(release.tag_name)}`)
  else compare('version/tag_name', record.version, release.tag_name)
  compare('releaseUrl', record.releaseUrl, release.html_url, 'URL_MISMATCH')
  compare('releaseDate', record.releaseDate, release.published_at?.slice(0, 10), 'DATE_MISMATCH')
  for (const item of downloadItems(record)) {
    const field = `downloads[${item.filename || 'filename 없음'}]`
    if (!/^\d+ bytes$/.test(item.size || '')) errors.push(`INVALID_SIZE: ${field}.size actual=${JSON.stringify(item.size)} expected="<integer> bytes"`)
    if (!/^[a-f0-9]{64}$/i.test(item.sha256 || '')) errors.push(`INVALID_SHA: ${field}.sha256 actual=${JSON.stringify(item.sha256)} expected=64 hexadecimal characters`)
    const asset = release.assets?.find((candidate) => candidate.name === item.filename)
    if (!asset) { errors.push(`ASSET_NOT_FOUND: ${field}.filename actual=${JSON.stringify(item.filename)} expected=existing release asset`); continue }
    compare(`${field}.size`, item.size, `${asset.size} bytes`, 'SIZE_MISMATCH')
    compare(`${field}.url`, item.url, asset.browser_download_url, 'URL_MISMATCH')
    if (asset.digest?.startsWith('sha256:')) compare(`${field}.sha256`, item.sha256?.toLowerCase(), asset.digest.slice(7).toLowerCase(), 'DIGEST_MISMATCH')
    else notices.push(`${field}: GitHub API에서 digest를 제공하지 않아 SHA 원격 비교를 생략함 (로컬 형식 검증 유지)`)
  }
  if (record.downloadUrl && !release.assets?.some((asset) => asset.browser_download_url === record.downloadUrl)) errors.push(`ASSET_NOT_FOUND: downloadUrl actual=${record.downloadUrl} expected=release asset URL`)
  return { errors, notices }
}

export async function verifyProject(project, { token, fetcher = fetch, ...requestOptions } = {}) {
  const patchVersions = project.webPatcher?.versions || []
  const withPatch = (record) => {
    const patch = patchVersions.find(item => item.version === record.version)?.patch
    return patch ? { ...record, downloads: [{ ...patch, size: `${patch.size} bytes` }] } : record
  }
  const records = [withPatch(project)]
  const preview = prereleaseRecord(project)
  if (preview) records.push(preview)
  for (const version of [...(project.downloadVersions || []), ...patchVersions]) {
    if (records.some(record => record.version === version.version)) continue
    records.push(withPatch({ repository: project.repository, ...version,
      releasePolicy: version.releasePolicy || (version.prerelease ? 'pinned-prerelease' : 'pinned'),
      pinReason: version.pinReason || '사용자가 선택할 수 있는 공개 패치 버전' }))
  }
  const result = { errors: [], notices: [] }
  for (const [index, record] of records.entries()) {
    const expectedPrerelease = record.releasePolicy?.endsWith('prerelease') || false
    const checked = await verifyReleaseRecord(record, { expectedPrerelease, token, fetcher, requestOptions })
    const prefix = index === 0 ? '' : record === preview ? 'prerelease: ' : `${record.version}: `
    result.errors.push(...checked.errors.map(error => prefix + error))
    result.notices.push(...checked.notices.map(notice => prefix + notice))
  }
  return result
}

async function main() {
  const file = new URL('../src/data/projects.json', import.meta.url)
  const projects = JSON.parse(readFileSync(file, 'utf8'))
  let failures = 0
  // Deliberately sequential: bounded concurrency of one, including retries.
  for (const project of projects) {
    const { errors, notices } = await verifyProject(project, { token: process.env.GITHUB_TOKEN })
    for (const notice of notices) console.warn(`[${project.id}] ${notice}`)
    for (const error of errors) console.error(`src/data/projects.json [${project.id}] ${error}`)
    failures += errors.length
    if (!errors.length) {
      const preview = prereleaseRecord(project)
      const channels = preview ? `${project.version} (${releasePolicy(project)}) + ${preview.version} (${releasePolicy(preview)})` : `${project.version} (${releasePolicy(project)})`
      console.log(`[${project.id}] ${channels}: 공개 Release 태그·날짜·URL·자산 검증 성공`)
    }
  }
  if (failures) { console.error(`원격 Release 검증 실패: ${failures}건 (데이터는 수정하지 않았습니다)`); process.exitCode = 1 }
  else console.log(`원격 Release 검증 성공: ${projects.length}개 프로젝트`)
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch(() => { console.error(`원격 검증 입력 파일 오류: ${fileURLToPath(new URL('../src/data/projects.json', import.meta.url))}`); process.exitCode = 1 })
}
