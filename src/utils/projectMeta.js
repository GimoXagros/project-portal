export const typeLabels = {
  all: '전체',
  'korean-patch': '한국어 패치',
  emulator: '에뮬레이터',
  port: '포팅',
  tool: '도구',
  translation: '번역',
  utility: '유틸리티',
  other: '기타',
}

export const statusLabels = {
  released: '정식 배포',
  beta: '베타',
  'work-in-progress': '개발 중',
  archived: '보관됨',
  planned: '준비 중',
}

export const filterTypes = ['all', 'korean-patch', 'emulator', 'port', 'tool', 'other']

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

export function hasDownload(project) {
  if (!project.downloadEnabled) return false
  if (project.downloadUrl) return true
  return (project.downloads || []).some((item) => item.url || (item.parts || []).some((part) => part.url))
}

export function assetUrl(path) {
  if (!path || /^(https?:|data:|blob:)/i.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\.?\//, '')}`
}
