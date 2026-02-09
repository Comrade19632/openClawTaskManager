import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

const API_BASE = import.meta.env.VITE_API_BASE || '/taskManager/api'
const BOT_USERNAME = import.meta.env.VITE_TG_BOT_USERNAME || 'click_ai_tg_bot'

function joinBase(base, path) {
  const b = (base || '').replace(/\/+$/, '')
  const p = (path || '').startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

async function apiFetch(path, { method = 'GET', body, token } = {}) {
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

function Login({ onToken }) {
  const [err, setErr] = useState('')

  useEffect(() => {
    // Telegram widget will call window.onTelegramAuth(user)
    window.onTelegramAuth = async user => {
      setErr('')
      try {
        const d = await apiFetch('/auth/telegram/', { method: 'POST', body: user })
        onToken(d.token)
      } catch (e) {
        setErr(e?.message || 'Ошибка логина')
      }
    }

    // Load widget script
    const s = document.createElement('script')
    s.async = true
    s.src = 'https://telegram.org/js/telegram-widget.js?22'
    s.setAttribute('data-telegram-login', BOT_USERNAME)
    s.setAttribute('data-size', 'large')
    s.setAttribute('data-userpic', 'true')
    s.setAttribute('data-request-access', 'write')
    s.setAttribute('data-onauth', 'onTelegramAuth(user)')

    const mount = document.getElementById('tg-login')
    mount.innerHTML = ''
    mount.appendChild(s)

    return () => {
      delete window.onTelegramAuth
    }
  }, [onToken])

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ margin: '0 0 8px' }}>TaskManager</h1>
      <p style={{ margin: '0 0 16px', opacity: 0.8 }}>Вход через Telegram</p>
      <div id="tg-login" />
      {err ? <div style={{ marginTop: 12, color: '#b00020' }}>{err}</div> : null}
    </div>
  )
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('tm_token') || '')
  const [me, setMe] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!token) return
    localStorage.setItem('tm_token', token)
    apiFetch('/me/', { token })
      .then(setMe)
      .catch(e => setErr(e?.message || 'Ошибка'))
  }, [token])

  if (!token) return <Login onToken={setToken} />

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>TaskManager</h1>
      {err ? <div style={{ color: '#b00020' }}>{err}</div> : null}
      <pre style={{ background: '#111', color: '#ddd', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
        {JSON.stringify(me, null, 2)}
      </pre>
      <button onClick={() => { localStorage.removeItem('tm_token'); setToken(''); }}>
        Выйти
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
