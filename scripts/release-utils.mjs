export function repositoryParts(repository) {
  const url = new URL(repository)
  if (url.origin !== 'https://github.com' || url.username || url.password || url.search || url.hash) throw new Error('repository must be an HTTPS github.com owner/repository URL')
  const match = url.pathname.replace(/\/$/, '').match(/^\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/)
  if (!match) throw new Error('repository must contain exactly owner/repository')
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

export function releasePolicy(project) {
  const policy = project.releasePolicy === undefined ? 'latest-stable' : project.releasePolicy
  const allowed = ['latest-stable', 'pinned', 'latest-prerelease', 'pinned-prerelease']
  if (!allowed.includes(policy)) throw new Error(`releasePolicy must be one of ${allowed.join(', ')}`)
  const pinned = ['pinned', 'pinned-prerelease'].includes(policy)
  if (pinned && (typeof project.pinReason !== 'string' || !project.pinReason.trim())) throw new Error(`${policy} releasePolicy requires a non-empty pinReason`)
  if (!pinned && project.pinReason !== undefined) throw new Error('pinReason is only allowed with a pinned releasePolicy')
  return policy
}

export function prereleaseRecord(project) {
  if (!project.prerelease || typeof project.prerelease !== 'object' || Array.isArray(project.prerelease)) return null
  return { repository: project.repository, downloadUrl: '', ...project.prerelease }
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
