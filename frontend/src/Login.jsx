import React, { useEffect, useState } from 'react'
import { apiFetch } from './api'
import { Card, TopBar } from './ui'

const BOT_USERNAME = import.meta.env.VITE_TG_BOT_USERNAME || 'click_ai_tg_bot'

export function Login({ onToken }) {
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
    if (mount) {
      mount.innerHTML = ''
      mount.appendChild(s)
    }

    return () => {
      delete window.onTelegramAuth
    }
  }, [onToken])

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6edf3', fontFamily: 'system-ui' }}>
      <TopBar title="TaskManager" />
      <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
        <Card>
          <div style={{ fontSize: 16, fontWeight: 750, marginBottom: 8 }}>Вход через Telegram</div>
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
