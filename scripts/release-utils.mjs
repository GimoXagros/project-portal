export function repositoryParts(repository) {
  const url = new URL(repository)
  if (url.origin !== 'https://github.com' || url.username || url.password || url.search || url.hash) throw new Error('repository must be an HTTPS github.com owner/repository URL')
  const match = url.pathname.replace(/\/$/, '').match(/^\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/)
  if (!match) throw new Error('repository must contain exactly owner/repository')
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

export function releasePolicy(project) {
  const policy = project.releasePolicy === undefined ? 'latest-stable' : project.releasePolicy
  if (!['latest-stable', 'pinned'].includes(policy)) throw new Error('releasePolicy must be latest-stable or pinned')
  if (policy === 'pinned' && (typeof project.pinReason !== 'string' || !project.pinReason.trim())) throw new Error('pinned releasePolicy requires a non-empty pinReason')
  if (policy !== 'pinned' && project.pinReason !== undefined) throw new Error('pinReason is only allowed with pinned releasePolicy')
  return policy
}

export function releaseIdentity(project) {
  const { owner, repo } = repositoryParts(project.repository)
  const prefix = `https://github.com/${owner}/${repo}/releases/tag/`
  if (!project.releaseUrl?.startsWith(prefix)) throw new Error(`releaseUrl must start with ${prefix}`)
  const tag = decodeURIComponent(project.releaseUrl.slice(prefix.length))
  if (!/^[A-Za-z0-9][A-Za-z0-9._+-]*$/.test(tag)) throw new Error('invalid release tag format')
  if (tag !== project.version) throw new Error(`version actual=${project.version}, expected=${tag}`)
  return { owner, repo, tag }
}

export function downloadItems(project) {
  const flatten = (items) => items.flatMap((item) => [item, ...flatten(item.parts || [])])
  return flatten(project.downloads || []).filter((item) => item.url || item.filename)
}

export function expectedAssetUrl(project, filename) {
  const { owner, repo, tag } = releaseIdentity(project)
  return `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(filename)}`
}
