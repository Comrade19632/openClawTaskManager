import React, { useEffect, useState } from 'react'
import { apiFetch } from './api'
import { safeErrorMessage } from './utils'
import { TopBar, Button } from './ui'
import { Login } from './Login'
import { Projects } from './Projects'
import { Board } from './Board'

export function App() {
  const [token, setToken] = useState(localStorage.getItem('tm_token') || '')
  const [me, setMe] = useState(null)
  const [err, setErr] = useState('')
  const [activeProject, setActiveProject] = useState(null)

  const logout = () => {
    localStorage.removeItem('tm_token')
    setToken('')
    setMe(null)
    setActiveProject(null)
  }

  useEffect(() => {
    if (!token) return
    localStorage.setItem('tm_token', token)
    setErr('')
    apiFetch('/me/', { token })
      .then(setMe)
      .catch(e => {
        if (e?.status === 401) logout()
        else setErr(safeErrorMessage(e))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token) return <Login onToken={setToken} />

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6edf3', fontFamily: 'system-ui' }}>
      <TopBar
        title={activeProject ? 'Канбан' : 'Проекты'}
        right={
          <>
            <div style={{ opacity: 0.75, fontSize: 13, maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {me?.telegram?.first_name
                ? `Вы: ${me.telegram.first_name}`
                : me?.user?.username
                  ? `Вы: ${me.user.username}`
                  : ''}
            </div>
            <Button onClick={logout}>Выйти</Button>
          </>
        }
      />

      {err ? <div style={{ padding: '12px 24px', color: '#ff6b6b' }}>Ошибка: {err}</div> : null}

      {activeProject ? (
        <Board token={token} project={activeProject} onBack={() => setActiveProject(null)} onUnauthorized={logout} />
      ) : (
        <Projects token={token} onOpenProject={p => setActiveProject(p)} onUnauthorized={logout} />
      )}
    </div>
  )
}
