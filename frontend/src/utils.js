export function joinBase(base, path) {
  const b = (base || '').replace(/\/+$/, '')
  const p = (path || '').startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

export function formatDateTimeShort(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  // "коротко: дата+время" без секунд, RU локаль
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}.${mm} ${hh}:${min}`
}

export function safeErrorMessage(e) {
  if (!e) return 'Ошибка'
  if (typeof e === 'string') return e
  return e.message || 'Ошибка'
}
