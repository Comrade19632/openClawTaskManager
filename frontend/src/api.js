import { joinBase } from './utils'

const API_BASE = import.meta.env.VITE_API_BASE || '/taskManager/api'

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(joinBase(API_BASE, path), {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    const msg = (data && (data.message || data.error || data.detail)) || `HTTP ${res.status}`
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}
