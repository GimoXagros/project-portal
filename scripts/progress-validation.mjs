import { isISODate } from '../src/utils/dates.js'

export function validateProgress(progress) {
  const errors = []
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return ['progress must be an object']
  if (!isISODate(progress.updatedAt)) errors.push('progress.updatedAt must be a valid date')
  if (typeof progress.summary !== 'string' || !progress.summary.trim()) errors.push('progress.summary is required')
  if (!Array.isArray(progress.stages) || !progress.stages.length) return [...errors, 'progress.stages must be non-empty']
  const ids = new Set()
  for (const stage of progress.stages) {
    if (!stage || typeof stage !== 'object') { errors.push('progress stage must be an object'); continue }
    if (!/^[a-z0-9-]+$/.test(stage.id || '') || ids.has(stage.id)) errors.push('progress stage id must be unique and safe')
    ids.add(stage.id)
    for (const key of ['label', 'detail']) if (typeof stage[key] !== 'string' || !stage[key].trim()) errors.push(`progress.${stage.id}.${key} is required`)
    if (!['complete', 'in-progress', 'not-started', 'unverified'].includes(stage.status)) errors.push(`progress.${stage.id}.status is invalid`)
    if (stage.percent !== null && (typeof stage.percent !== 'number' || !Number.isFinite(stage.percent) || stage.percent < 0 || stage.percent > 100)) errors.push(`progress.${stage.id}.percent must be null or 0–100`)
    if (stage.status === 'unverified' && stage.percent !== null) errors.push(`progress.${stage.id}: unverified progress cannot have a percentage`)
    if (stage.percent !== null && ((stage.status === 'complete' && stage.percent !== 100) || (stage.status === 'not-started' && stage.percent !== 0))) errors.push(`progress.${stage.id}: percentage contradicts status`)
    try {
      const url = new URL(stage.sourceUrl)
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error()
    } catch { errors.push(`progress.${stage.id}.sourceUrl must be an HTTPS source`) }
  }
  return errors
}
