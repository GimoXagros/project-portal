const modules = import.meta.glob('./*.json', { eager: true })

const changelogs = Object.values(modules).map((module) => module.default)
const changelogByProject = new Map(changelogs.map((changelog) => [changelog.projectId, changelog]))

export function getProjectChangelog(projectId) {
  return changelogByProject.get(projectId) || { projectId, displayName: projectId, entries: [] }
}

export function getLatestProjectUpdate(projectId) {
  return getProjectChangelog(projectId).entries[0] || null
}

export function getAllLatestUpdates() {
  return changelogs
    .map((changelog) => {
      const latest = changelog.entries[0]
      return latest ? { ...latest, projectId: changelog.projectId, projectTitle: changelog.displayName } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date) || a.projectTitle.localeCompare(b.projectTitle, 'ko'))
}

export { changelogs }
