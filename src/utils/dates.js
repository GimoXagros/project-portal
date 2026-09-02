// Calendar-only dates: validate without parsing into a timezone-dependent Date.
export function isISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1]
}

export function latestDate(values) {
  return values.filter(isISODate).reduce((latest, date) => date > latest ? date : latest, '')
}

export function sortUpdates(entries = []) {
  return entries.filter((entry) => isISODate(entry.date)).slice().sort((a, b) =>
    b.date.localeCompare(a.date) || (b.version || '').localeCompare(a.version || '', 'en', { numeric: true }) || (a.id || '').localeCompare(b.id || ''))
}
