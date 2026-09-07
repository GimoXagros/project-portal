import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { basename, extname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isISODate } from '../src/utils/dates.js'
import { downloadItems, expectedAssetUrl, prereleaseRecord, releaseIdentity, releasePolicy } from './release-utils.mjs'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
// The CLI and offline tests use the same complete static validation path.
export function validateData(projectsOverride) {
  const projectsFile = join(root, 'src', 'data', 'projects.json')
  const changelogDir = join(root, 'src', 'data', 'changelogs')
  const projects = projectsOverride ?? JSON.parse(readFileSync(projectsFile, 'utf8'))
  const site = JSON.parse(readFileSync(join(root, 'src', 'data', 'site.json'), 'utf8'))
  const errors = []
  const fail = (file, id, message) => errors.push(`${file}${id ? ` [${id}]` : ''}: ${message}`)
  const sha256 = /^[a-f0-9]{64}$/i
  const safeId = /^[a-z0-9-]+$/
  const isoDate = { test: isISODate }
  const remote = /^https:\/\//i

  const seen = new Set()
  for (const project of projects) {
    if (!safeId.test(project.id || '')) fail('src/data/projects.json', project.id, 'id는 소문자 영문, 숫자, 하이픈만 사용할 수 있습니다.')
    if (seen.has(project.id)) fail('src/data/projects.json', project.id, '중복된 프로젝트 id입니다.')
    seen.add(project.id)
    const fieldError = (field, actual, expected) => fail('src/data/projects.json', project.id, `${field}: actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`)
    for (const field of ['releaseDate', 'lastUpdated']) if (!isISODate(project[field])) fieldError(field, project[field], 'valid YYYY-MM-DD calendar date')
    if (project.releaseDate > project.lastUpdated) fieldError('releaseDate', project.releaseDate, `<= lastUpdated (${project.lastUpdated})`)
    try { releaseIdentity(project) } catch (error) { fieldError('repository/releaseUrl/version', [project.repository, project.releaseUrl, project.version], error.message) }
    try { releasePolicy(project) } catch (error) { fieldError('releasePolicy/pinReason', [project.releasePolicy, project.pinReason], error.message) }
    const filenames = new Set()
    for (const item of downloadItems(project)) {
      const field = `downloads[${item.filename || 'missing'}]`
      if (!item.filename || filenames.has(item.filename)) fieldError(`${field}.filename`, item.filename, 'non-empty unique filename')
      filenames.add(item.filename)
      if (item.size && !/^\d+ bytes$/.test(item.size)) fieldError(`${field}.size`, item.size, '<integer> bytes')
      if (item.sha256 && !sha256.test(item.sha256)) fieldError(`${field}.sha256`, item.sha256, '64 hexadecimal characters')
      if (item.url) {
        try { const expected = expectedAssetUrl(project, item.filename); if (item.url !== expected) fieldError(`${field}.url`, item.url, expected) }
        catch (error) { fieldError(`${field}.url`, item.url, error.message) }
      }
    }
    const preview = prereleaseRecord(project)
    if (project.prerelease !== undefined && !preview) fieldError('prerelease', project.prerelease, 'object with prerelease release metadata')
    if (preview) {
      for (const field of ['version', 'releaseDate', 'releaseUrl', 'title', 'summary']) {
        if (typeof preview[field] !== 'string' || !preview[field].trim()) fieldError(`prerelease.${field}`, preview[field], 'non-empty string')
      }
      if (!isISODate(preview.releaseDate)) fieldError('prerelease.releaseDate', preview.releaseDate, 'valid YYYY-MM-DD calendar date')
      if (preview.releaseDate > project.lastUpdated) fieldError('prerelease.releaseDate', preview.releaseDate, `<= lastUpdated (${project.lastUpdated})`)
      try { releaseIdentity(preview) } catch (error) { fieldError('prerelease.repository/releaseUrl/version', [preview.repository, preview.releaseUrl, preview.version], error.message) }
      try {
        const policy = releasePolicy(preview)
        if (!['latest-prerelease', 'pinned-prerelease'].includes(policy)) fieldError('prerelease.releasePolicy', policy, 'latest-prerelease or pinned-prerelease')
      } catch (error) { fieldError('prerelease.releasePolicy/pinReason', [preview.releasePolicy, preview.pinReason], error.message) }
      const previewFilenames = new Set()
      for (const item of downloadItems(preview)) {
        const field = `prerelease.downloads[${item.filename || 'missing'}]`
        if (!item.filename || previewFilenames.has(item.filename)) fieldError(`${field}.filename`, item.filename, 'non-empty unique filename')
        previewFilenames.add(item.filename)
        if (item.size && !/^\d+ bytes$/.test(item.size)) fieldError(`${field}.size`, item.size, '<integer> bytes')
        if (item.sha256 && !sha256.test(item.sha256)) fieldError(`${field}.sha256`, item.sha256, '64 hexadecimal characters')
        if (item.url) {
          try { const expected = expectedAssetUrl(preview, item.filename); if (item.url !== expected) fieldError(`${field}.url`, item.url, expected) }
          catch (error) { fieldError(`${field}.url`, item.url, error.message) }
        }
      }
      if (!downloadItems(preview).length) fieldError('prerelease.downloads', preview.downloads, 'at least one release asset')
      if (!Array.isArray(preview.notes) || preview.notes.some((note) => typeof note !== 'string' || !note.trim())) fieldError('prerelease.notes', preview.notes, 'string array')
    }

      const patcherRelease = preview?.webPatcher ? preview : project
      const patcherField = preview?.webPatcher ? 'prerelease.webPatcher' : 'webPatcher'
      const webPatcher = patcherRelease.webPatcher
      if (webPatcher !== undefined) {
        const validObject = webPatcher && typeof webPatcher === 'object' && !Array.isArray(webPatcher)
        if (!validObject) fieldError(patcherField, webPatcher, 'object')
        else {
          if (webPatcher.engine !== 'RomPatcher.js') fieldError(`${patcherField}.engine`, webPatcher.engine, 'RomPatcher.js')
          if (webPatcher.engineVersion !== 'v3.2.1') fieldError(`${patcherField}.engineVersion`, webPatcher.engineVersion, 'v3.2.1')
          if (webPatcher.format !== 'BPS') fieldError(`${patcherField}.format`, webPatcher.format, 'BPS')
          if (typeof webPatcher.defaultVersion !== 'string' || !webPatcher.defaultVersion.trim()) fieldError(`${patcherField}.defaultVersion`, webPatcher.defaultVersion, 'non-empty string')
          if (webPatcher.defaultVersion !== patcherRelease.version) fieldError(`${patcherField}.defaultVersion`, webPatcher.defaultVersion, `current release version (${patcherRelease.version})`)
          if (!Array.isArray(webPatcher.versions) || !webPatcher.versions.length) fieldError(`${patcherField}.versions`, webPatcher.versions, 'non-empty array')
          else {
            const versionNames = new Set()
            const patchPaths = new Set()
            for (const [index, version] of webPatcher.versions.entries()) {
              const name = version?.version || index
              const base = `${patcherField}.versions[${name}]`
              if (!version || typeof version !== 'object' || Array.isArray(version)) {
                fieldError(base, version, 'object')
                continue
              }
              for (const field of ['version', 'releaseDate', 'releaseUrl', 'title', 'summary']) if (typeof version[field] !== 'string' || !version[field].trim()) fieldError(`${base}.${field}`, version[field], 'non-empty string')
              if (versionNames.has(version.version)) fieldError(`${base}.version`, version.version, 'unique patch version')
              versionNames.add(version.version)
              if (!isISODate(version.releaseDate)) fieldError(`${base}.releaseDate`, version.releaseDate, 'valid YYYY-MM-DD calendar date')
              if (version.releaseDate > project.lastUpdated) fieldError(`${base}.releaseDate`, version.releaseDate, `<= lastUpdated (${project.lastUpdated})`)
              const releaseRecord = { repository: project.repository, version: version.version, releaseUrl: version.releaseUrl }
              try { releaseIdentity(releaseRecord) } catch (error) { fieldError(`${base}.releaseUrl`, version.releaseUrl, error.message) }
              for (const part of ['source', 'patch', 'output']) {
                const descriptor = version[part]
                if (!descriptor || typeof descriptor !== 'object' || Array.isArray(descriptor)) {
                  fieldError(`${base}.${part}`, descriptor, 'object')
                  continue
                }
                if (!Number.isSafeInteger(descriptor.size) || descriptor.size <= 0) fieldError(`${base}.${part}.size`, descriptor.size, 'positive safe integer')
                if (!sha256.test(descriptor.sha256 || '')) fieldError(`${base}.${part}.sha256`, descriptor.sha256, '64 hexadecimal characters')
              }
              if (!version.source?.label?.trim()) fieldError(`${base}.source.label`, version.source?.label, 'non-empty string')
              for (const part of ['patch', 'output']) if (!/^[^\\/]+$/.test(version[part]?.filename || '')) fieldError(`${base}.${part}.filename`, version[part]?.filename, 'plain filename without path separators')
              if (!/\.bps$/i.test(version.patch?.filename || '')) fieldError(`${base}.patch.filename`, version.patch?.filename, '*.bps')
              if (!/\.gba$/i.test(version.output?.filename || '')) fieldError(`${base}.output.filename`, version.output?.filename, '*.gba')
              try {
                const expected = expectedAssetUrl(releaseRecord, version.patch?.filename)
                if (version.patch?.url !== expected) fieldError(`${base}.patch.url`, version.patch?.url, expected)
              } catch (error) { fieldError(`${base}.patch.url`, version.patch?.url, error.message) }
              const patchPath = version.patch?.path
              if (typeof patchPath !== 'string' || !/^patches\/[A-Za-z0-9._/-]+\.bps$/.test(patchPath) || patchPath.includes('..')) fieldError(`${base}.patch.path`, patchPath, 'safe public patches/*.bps path')
              else if (patchPaths.has(patchPath)) fieldError(`${base}.patch.path`, patchPath, 'unique patch path')
              else {
                patchPaths.add(patchPath)
                const localPatch = join(root, 'public', ...patchPath.split('/'))
                if (!existsSync(localPatch)) fieldError(`${base}.patch.path`, patchPath, 'existing local patch file')
                else {
                  const contents = readFileSync(localPatch)
                  const digest = createHash('sha256').update(contents).digest('hex')
                  if (contents.byteLength !== version.patch.size) fieldError(`${base}.patch.size`, version.patch.size, contents.byteLength)
                  if (digest !== version.patch.sha256) fieldError(`${base}.patch.sha256`, version.patch.sha256, digest)
                }
              }
              if (version.version === patcherRelease.version) {
                const releasePatch = downloadItems(patcherRelease).find((item) => item.filename === version.patch?.filename)
                if (!releasePatch) fieldError(`${base}.patch.filename`, version.patch?.filename, 'matching current release download asset')
                else {
                  if (releasePatch.url !== version.patch.url) fieldError(`${base}.patch.url`, version.patch.url, releasePatch.url)
                  if (releasePatch.sha256 !== version.patch.sha256) fieldError(`${base}.patch.sha256`, version.patch.sha256, releasePatch.sha256)
                  if (releasePatch.size !== `${version.patch.size} bytes`) fieldError(`${base}.patch.size`, version.patch.size, releasePatch.size)
                }
              }
            }
            if (!versionNames.has(webPatcher.defaultVersion)) fieldError(`${patcherField}.defaultVersion`, webPatcher.defaultVersion, 'version present in versions')
          }
        }
      }
    if (project.downloadUrl) {
      const prefix = project.releaseUrl?.replace('/releases/tag/', '/releases/download/') + '/'
      if (!project.downloadUrl.startsWith(prefix) || /[?#]/.test(project.downloadUrl)) fieldError('downloadUrl', project.downloadUrl, `${prefix}<asset filename>`)
    }
    if (project.demo === true || /SAMPLE_PROJECT/i.test(project.id || '')) fail('src/data/projects.json', project.id, '임시 프로젝트 데이터가 남아 있습니다.')

    const branding = project.branding
    if (branding?.logo) {
      if (/^https?:\/\//i.test(branding.logo)) fail('src/data/projects.json', project.id, 'branding.logo는 외부 hotlink가 아닌 public 내부 경로여야 합니다.')
      if (!branding.logoAlt?.trim()) fail('src/data/projects.json', project.id, 'branding.logoAlt가 필요합니다.')
      const logoPath = join(root, 'public', branding.logo.replace(/^\.?[\\/]/, ''))
      if (!existsSync(logoPath)) fail('src/data/projects.json', project.id, `branding.logo 자산이 존재하지 않습니다: ${branding.logo}`)
    }

    const downloads = downloadItems(project)
    if (project.downloadEnabled) {
      if (!project.downloadUrl && !downloads.some((item) => item.url)) fail('src/data/projects.json', project.id, 'downloadEnabled가 true지만 다운로드 URL이 없습니다.')
      for (const item of downloads) {
        if (!item.url) fail('src/data/projects.json', project.id, `다운로드 “${item.label || item.filename || '이름 없음'}”의 URL이 없습니다.`)
        else if (!remote.test(item.url)) fail('src/data/projects.json', project.id, `다운로드 URL은 https://로 시작해야 합니다: ${item.url}`)
      }
      if (project.downloadUrl && !remote.test(project.downloadUrl)) fail('src/data/projects.json', project.id, 'downloadUrl은 https://로 시작해야 합니다.')
    }

    const hashValues = [project.originalHash, project.patchHash, project.patchedHash, ...(project.hashes || []).map((item) => item.value), ...downloads.map((item) => item.sha256), ...downloadItems(preview || {}).map((item) => item.sha256)].filter(Boolean)
    for (const value of hashValues) if (!sha256.test(value)) fail('src/data/projects.json', project.id, `SHA-256은 64자리 hexadecimal이어야 합니다: ${value}`)

    const imageRefs = [project.coverImage, branding?.logo, ...(project.screenshots || []).map((item) => item.src)].filter(Boolean)
    for (const image of imageRefs) {
      if (/^(https?:|data:|blob:)/i.test(image)) continue
      const localPath = join(root, 'public', image.replace(/^\.?[\\/]/, ''))
      if (!existsSync(localPath)) fail('src/data/projects.json', project.id, `로컬 이미지가 존재하지 않습니다: ${image}`)
    }
  }

  const projectIds = new Set(projects.map((project) => project.id))
  const changelogFiles = existsSync(changelogDir) ? readdirSync(changelogDir).filter((file) => file.endsWith('.json')) : []
  const changelogProjectIds = new Set()

  for (const file of changelogFiles) {
    const filePath = join(changelogDir, file)
    const relativeFile = `src/data/changelogs/${file}`
    const changelog = JSON.parse(readFileSync(filePath, 'utf8'))
    const expectedId = basename(file, '.json')
    if (!changelog.projectId) fail(relativeFile, '', 'projectId가 필요합니다.')
    if (changelog.projectId !== expectedId) fail(relativeFile, changelog.projectId, `파일명과 projectId가 일치해야 합니다: ${expectedId}`)
    if (!projectIds.has(changelog.projectId)) fail(relativeFile, changelog.projectId, 'projects.json에 없는 고아 changelog입니다.')
    changelogProjectIds.add(changelog.projectId)
    const project = projects.find((item) => item.id === changelog.projectId)
    const latest = changelog.entries?.[0]
    if (project?.version && !latest) fail(relativeFile, project.id, 'entries[0]: actual=missing expected=current project release')
    if (project && latest) {
      const projectIsPrerelease = typeof project.releasePolicy === 'string' && project.releasePolicy.endsWith('prerelease')
      const current = project.prerelease
        ? { version: project.prerelease.version, releaseUrl: project.prerelease.releaseUrl, date: project.prerelease.releaseDate, status: 'prerelease' }
        : { version: project.version, releaseUrl: project.releaseUrl, date: project.lastUpdated, ...(projectIsPrerelease ? { status: 'prerelease' } : {}) }
      for (const field of ['version', 'releaseUrl', 'date']) {
        if (current[field] !== latest[field]) fail(relativeFile, project.id, `entries[0].${field}: actual=${JSON.stringify(latest[field])} expected=current release ${JSON.stringify(current[field])}`)
      }
      if (current.status && latest.status !== current.status) fail(relativeFile, project.id, `entries[0].status: actual=${JSON.stringify(latest.status)} expected=${JSON.stringify(current.status)}`)
    }

    const entryIds = new Set()
    let previousDate = null
    if (!Array.isArray(changelog.entries)) fail(relativeFile, changelog.projectId, 'entries는 배열이어야 합니다.')
    for (const entry of Array.isArray(changelog.entries) ? changelog.entries : []) {
      if (!entry.id || entryIds.has(entry.id)) fail(relativeFile, changelog.projectId, `update id가 없거나 중복됩니다: ${entry.id || '값 없음'}`)
      entryIds.add(entry.id)
      for (const field of ['version', 'date', 'title', 'summary']) if (typeof entry[field] !== 'string' || !entry[field].trim()) fail(relativeFile, changelog.projectId, `${entry.id || '항목'}의 ${field}가 필요합니다.`)
      if (entry.date && !isoDate.test(entry.date)) fail(relativeFile, changelog.projectId, `${entry.id}.date: actual=${JSON.stringify(entry.date)} expected=valid YYYY-MM-DD calendar date`)
      if (previousDate && entry.date > previousDate) fail(relativeFile, changelog.projectId, `${entry.id}.date: actual=${JSON.stringify(entry.date)} expected=<= ${previousDate} (entries 최신순)`)
      previousDate = entry.date
      if (entry.releaseUrl && !remote.test(entry.releaseUrl)) fail(relativeFile, changelog.projectId, `${entry.id}의 releaseUrl은 https://로 시작해야 합니다.`)
      if (entry.status !== undefined && !['release', 'beta', 'prerelease'].includes(entry.status)) fail(relativeFile, changelog.projectId, `${entry.id}.status: actual=${JSON.stringify(entry.status)} expected=release, beta or prerelease`)
      if (!Array.isArray(entry.changes) || entry.changes.some((change) => typeof change !== 'string')) fail(relativeFile, changelog.projectId, `${entry.id}의 changes는 문자열 배열이어야 합니다.`)
    }
  }

  for (const id of projectIds) if (!changelogProjectIds.has(id)) fail('src/data/changelogs', id, '등록 프로젝트에 대응하는 changelog JSON이 없습니다.')
  if (existsSync(join(root, 'src', 'data', 'changelog.json'))) fail('src/data/changelog.json', '', '이전 단일 changelog가 새 프로젝트별 데이터와 함께 남아 있습니다.')

  const textExtensions = new Set(['.html', '.json', '.js', '.jsx', '.css', '.svg', '.txt', '.xml', '.md'])
  const blockedText = [/C:\\Users\\/i, /Project Cabinet/i, /Portal Owner/i, /DEMO MODE/i, /SAMPLE_PROJECT/i, /raw\.githubusercontent\.com/i]
  const scanRoots = ['index.html', 'README.md', 'ASSET_SOURCES.md', 'src', 'public']
  const walk = (path) => readdirSync(path, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(path, entry.name)) : join(path, entry.name))
  const files = scanRoots.flatMap((item) => {
    const path = join(root, item)
    return extname(path) ? [path] : walk(path)
  }).filter((path) => textExtensions.has(extname(path).toLowerCase()))

  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    for (const pattern of blockedText) if (pattern.test(text)) fail(file.replace(`${root}\\`, ''), '', `공개 텍스트에 임시·로컬·hotlink 문자열이 남아 있습니다: ${pattern}`)
  }

  const indexHtml = readFileSync(join(root, 'index.html'), 'utf8')
  const robots = readFileSync(join(root, 'public', 'robots.txt'), 'utf8')
  const sitemap = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8')
  if (!indexHtml.includes(site.name)) fail('index.html', '', 'site.json의 사이트명이 정적 SEO에 반영되지 않았습니다.')
  if (!indexHtml.includes(site.siteUrl)) fail('index.html', '', 'site.json의 siteUrl이 canonical/Open Graph에 반영되지 않았습니다.')
  if (!robots.includes(`${site.siteUrl}sitemap.xml`)) fail('public/robots.txt', '', 'site.json의 siteUrl과 Sitemap URL이 일치하지 않습니다.')
  if (!sitemap.includes(`<loc>${site.siteUrl}</loc>`)) fail('public/sitemap.xml', '', 'site.json의 siteUrl과 sitemap loc가 일치하지 않습니다.')

  return { errors, projects: projects.length, changelogs: changelogFiles.length, featured: projects.filter((project) => project.featured).length }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const result = validateData()
  if (result.errors.length) {
    console.error(`데이터 검증 실패 (${result.errors.length}건)\n${result.errors.map((error) => `- ${error}`).join('\n')}`)
    process.exitCode = 1
  } else console.log(`데이터 검증 성공: 프로젝트 ${result.projects}개, changelog ${result.changelogs}개, featured ${result.featured}개`)
}
