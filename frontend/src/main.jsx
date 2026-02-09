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

function Card({ children, style }) {
  return (
    <div
      style={{
        background: '#0f141a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function TopBar({ title, right }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        background: '#0b0f14',
        zIndex: 5,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 650 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{right}</div>
    </div>
  )
}

function Button({ children, onClick, kind = 'default' }) {
  const bg = kind === 'primary' ? '#3b82f6' : 'rgba(255,255,255,0.06)'
  const border = kind === 'primary' ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.10)'
  return (
    <button
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: 10,
        padding: '8px 12px',
        background: bg,
        color: '#e6edf3',
        border: `1px solid ${border}`,
      }}
    >
      {children}
    </button>
  )
}

function Login({ onToken }) {
  const [err, setErr] = useState('')

  useEffect(() => {
    // Telegram widget will call window.onTelegramAuth(user)
    window.onTelegramAuth = async user => {
      setErr('')
      try {
        const d = await apiFetch('/auth/telegram/', { method: 'POST', body: user })
        if (!d?.token) throw new Error('Сервер не вернул token')
        onToken(d.token)
      } catch (e) {
        setErr(e?.message || 'Ошибка логина')
      }
    }

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
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6edf3', fontFamily: 'system-ui' }}>
      <TopBar title="TaskManager" />
      <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
        <Card>
          <div style={{ fontSize: 16, fontWeight: 650, marginBottom: 8 }}>Вход через Telegram</div>
          <div style={{ opacity: 0.8, marginBottom: 16 }}>
            Нажмите кнопку входа. После успешной авторизации вы попадёте на экран «Проекты».
          </div>
          <div id="tg-login" />
          {err ? <div style={{ marginTop: 12, color: '#ff6b6b' }}>{err}</div> : null}
        </Card>
      </div>
    </div>
  )
}

function ProjectsView({ projects, onOpenProject }) {
  return (
    <div style={{ padding: 24, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
      {projects.map(p => (
        <Card key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontWeight: 700 }}>{p.name}</div>
          <div style={{ opacity: 0.75, fontSize: 13 }}>{p.description}</div>
          <div style={{ marginTop: 8 }}>
            <Button kind="primary" onClick={() => onOpenProject(p)}>
              Открыть канбан
            </Button>
          </div>
        </Card>
      ))}
      <Card style={{ opacity: 0.75 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Скоро</div>
        <div style={{ fontSize: 13 }}>
          Здесь появится создание проектов и работа с задачами. Сейчас это минимальный скелет интерфейса.
        </div>
      </Card>
    </div>
  )
}

function KanbanStub({ project, onBack }) {
  const columns = [
    { id: 'todo', title: 'К выполнению', cards: ['Сформулировать требования', 'Нарисовать схему API'] },
    { id: 'doing', title: 'В работе', cards: ['Скелет интерфейса (в процессе)'] },
    { id: 'done', title: 'Готово', cards: ['Логин через Telegram'] },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Button onClick={onBack}>← Проекты</Button>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Канбан: {project?.name || 'Проект'}</div>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {columns.map(c => (
          <Card key={c.id} style={{ minHeight: 240 }}>
            <div style={{ fontWeight: 750, marginBottom: 10 }}>{c.title}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {c.cards.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 13,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ opacity: 0.7, marginTop: 14, fontSize: 13 }}>
        Заглушка: без сохранения, без drag&drop. Следующий шаг — реальные проекты/доски/задачи в API.
      </div>
    </div>
  )
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('tm_token') || '')
  const [me, setMe] = useState(null)
  const [err, setErr] = useState('')
  const [activeProject, setActiveProject] = useState(null)

  const projects = useMemo(
    () => [
      {
        id: 'default',
        name: 'Личный',
        description: 'Черновик для задач и идей. Пока без сохранения — UI-скелет.',
      },
    ],
    [],
  )

  useEffect(() => {
    if (!token) return
    localStorage.setItem('tm_token', token)
    setErr('')
    apiFetch('/me/', { token })
      .then(setMe)
      .catch(e => setErr(e?.message || 'Ошибка'))
  }, [token])

  const logout = () => {
    localStorage.removeItem('tm_token')
    setToken('')
    setMe(null)
    setActiveProject(null)
  }

  if (!token) return <Login onToken={setToken} />

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6edf3', fontFamily: 'system-ui' }}>
      <TopBar
        title={activeProject ? 'Канбан' : 'Проекты'}
        right={
          <>
            <div style={{ opacity: 0.75, fontSize: 13, maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {me?.telegram?.first_name ? `Вы: ${me.telegram.first_name}` : me?.user?.username ? `Вы: ${me.user.username}` : ''}
            </div>
            <Button onClick={logout}>Выйти</Button>
          </>
        }
      />

      {err ? (
        <div style={{ padding: '12px 24px', color: '#ff6b6b' }}>
          Ошибка: {err}
        </div>
      ) : null}

      {activeProject ? (
        <KanbanStub project={activeProject} onBack={() => setActiveProject(null)} />
      ) : (
        <ProjectsView projects={projects} onOpenProject={p => setActiveProject(p)} />
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
