export const typeLabels = {
  all: '전체',
  'korean-patch': '한국어 패치',
  emulator: '에뮬레이터',
  port: '포팅',
  tool: '도구',
  translation: '번역',
  utility: '호환 계층',
  other: '기타',
}

export const statusLabels = {
  released: '정식 배포',
  beta: '베타',
  'work-in-progress': '개발 중',
  archived: '보관됨',
  planned: '준비 중',
}

export const filterTypes = ['all', 'korean-patch', 'emulator', 'port', 'tool', 'utility', 'other']

export function getProjectSearchText(project) {
  return [
    project.title,
    project.titleOriginal,
    project.subtitle,
    project.description,
    ...(project.platform || []),
    ...(project.tags || []),
  ].filter(Boolean).join(' ').toLocaleLowerCase('ko')
}

export function hasReleaseDownload(release) {
  if (!release || release.downloadEnabled === false) return false
  if (release.downloadUrl) return true
  return (release.downloads || []).some((item) => item.url || (item.parts || []).some((part) => part.url))
}

export function hasDownload(project) {
  return hasReleaseDownload(project) || hasReleaseDownload(project?.prerelease)
}

export function assetUrl(path) {
  if (!path || /^(https?:|data:|blob:)/i.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\.?\//, '')}`
}

export function projectBrandStyle(project) {
  const branding = project?.branding || {}
  return {
    '--project-accent': branding.accent || '#cf5634',
    '--project-soft': branding.accentSoft || '#f1d6c9',
    '--project-dark': branding.accentDark || '#ee7955',
  }
}
