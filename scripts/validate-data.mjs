import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const projectsFile = join(root, 'src', 'data', 'projects.json')
const projects = JSON.parse(readFileSync(projectsFile, 'utf8'))
const site = JSON.parse(readFileSync(join(root, 'src', 'data', 'site.json'), 'utf8'))
const errors = []
const fail = (file, id, message) => errors.push(`${file}${id ? ` [${id}]` : ''}: ${message}`)
const sha256 = /^[a-f0-9]{64}$/i
const safeId = /^[a-z0-9-]+$/
const remote = /^https:\/\//i

const seen = new Set()
for (const project of projects) {
  if (!safeId.test(project.id || '')) fail('src/data/projects.json', project.id, 'id는 소문자 영문, 숫자, 하이픈만 사용할 수 있습니다.')
  if (seen.has(project.id)) fail('src/data/projects.json', project.id, '중복된 프로젝트 id입니다.')
  seen.add(project.id)
  if (project.demo === true || /SAMPLE_PROJECT/i.test(project.id || '')) fail('src/data/projects.json', project.id, '임시 프로젝트 데이터가 남아 있습니다.')

  const downloadItems = [...(project.downloads || []), ...(project.downloads || []).flatMap((item) => item.parts || [])]
  if (project.downloadEnabled) {
    if (!project.downloadUrl && !downloadItems.some((item) => item.url)) fail('src/data/projects.json', project.id, 'downloadEnabled가 true지만 다운로드 URL이 없습니다.')
    for (const item of downloadItems) {
      if (!item.url) fail('src/data/projects.json', project.id, `다운로드 “${item.label || item.filename || '이름 없음'}”의 URL이 없습니다.`)
      else if (!remote.test(item.url)) fail('src/data/projects.json', project.id, `다운로드 URL은 https://로 시작해야 합니다: ${item.url}`)
    }
    if (project.downloadUrl && !remote.test(project.downloadUrl)) fail('src/data/projects.json', project.id, 'downloadUrl은 https://로 시작해야 합니다.')
  }

  const hashValues = [project.originalHash, project.patchHash, project.patchedHash, ...(project.hashes || []).map((item) => item.value), ...downloadItems.map((item) => item.sha256)].filter(Boolean)
  for (const value of hashValues) if (!sha256.test(value)) fail('src/data/projects.json', project.id, `SHA-256은 64자리 hexadecimal이어야 합니다: ${value}`)

  const imageRefs = [project.coverImage, ...(project.screenshots || []).map((item) => item.src)].filter(Boolean)
  for (const image of imageRefs) {
    if (/^(https?:|data:|blob:)/i.test(image)) continue
    const localPath = join(root, 'public', image.replace(/^\.?[\\/]/, ''))
    if (!existsSync(localPath)) fail('src/data/projects.json', project.id, `로컬 이미지가 존재하지 않습니다: ${image}`)
  }
}

if (!projects.some((project) => project.featured)) fail('src/data/projects.json', '', 'featured 프로젝트가 하나 이상 필요합니다.')

const textExtensions = new Set(['.html', '.json', '.js', '.jsx', '.css', '.svg', '.txt', '.xml'])
const blockedText = [/C:\\Users\\/i, /Project Cabinet/i, /Portal Owner/i, /DEMO MODE/i, /SAMPLE_PROJECT/i]
const scanRoots = ['index.html', 'src', 'public']
const walk = (path) => {
  const entries = readdirSync(path, { withFileTypes: true })
  return entries.flatMap((entry) => entry.isDirectory() ? walk(join(path, entry.name)) : join(path, entry.name))
}
const files = scanRoots.flatMap((item) => {
  const path = join(root, item)
  return extname(path) ? [path] : walk(path)
}).filter((path) => textExtensions.has(extname(path).toLowerCase()))

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  for (const pattern of blockedText) if (pattern.test(text)) fail(file.replace(`${root}\\`, ''), '', `공개 텍스트에 임시 또는 로컬 문자열이 남아 있습니다: ${pattern}`)
}

const indexHtml = readFileSync(join(root, 'index.html'), 'utf8')
const robots = readFileSync(join(root, 'public', 'robots.txt'), 'utf8')
const sitemap = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8')
if (!indexHtml.includes(site.name)) fail('index.html', '', 'site.json의 사이트명이 정적 SEO에 반영되지 않았습니다.')
if (!indexHtml.includes(site.siteUrl)) fail('index.html', '', 'site.json의 siteUrl이 canonical/Open Graph에 반영되지 않았습니다.')
if (!robots.includes(`${site.siteUrl}sitemap.xml`)) fail('public/robots.txt', '', 'site.json의 siteUrl과 Sitemap URL이 일치하지 않습니다.')
if (!sitemap.includes(`<loc>${site.siteUrl}</loc>`)) fail('public/sitemap.xml', '', 'site.json의 siteUrl과 sitemap loc가 일치하지 않습니다.')

if (errors.length) {
  console.error(`데이터 검증 실패 (${errors.length}건)\n${errors.map((error) => `- ${error}`).join('\n')}`)
  process.exit(1)
}

console.log(`데이터 검증 성공: 프로젝트 ${projects.length}개, featured ${projects.filter((project) => project.featured).length}개`)
