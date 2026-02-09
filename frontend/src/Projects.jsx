import React, { useEffect, useState } from 'react'
import { apiFetch } from './api'
import { safeErrorMessage } from './utils'
import { Button, Card, Input } from './ui'

export function Projects({ token, onOpenProject, onUnauthorized }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const load = async () => {
    setLoading(true)
    setErr('')
    try {
      const d = await apiFetch('/projects/', { token })
      setProjects(Array.isArray(d) ? d : d?.results || [])
    } catch (e) {
      if (e?.status === 401) onUnauthorized?.()
      setErr(safeErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const create = async () => {
    setErr('')
    const n = name.trim()
    if (!n) {
      setErr('Введите название проекта')
      return
    }
    setCreating(true)
    try {
      const created = await apiFetch('/projects/', {
        method: 'POST',
        token,
        body: { name: n, description: description || '' },
      })
      setProjects(prev => [created, ...prev])
      setName('')
      setDescription('')
    } catch (e) {
      if (e?.status === 401) onUnauthorized?.()
      setErr(safeErrorMessage(e))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 750 }}>Ваши проекты</div>
        <Button onClick={load} disabled={loading}>
          {loading ? 'Загрузка…' : 'Обновить'}
        </Button>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 750, marginBottom: 10 }}>Создать проект</div>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr auto' }}>
          <Input value={name} onChange={setName} placeholder="Название *" />
          <Input value={description} onChange={setDescription} placeholder="Описание (необязательно)" />
          <Button kind="primary" onClick={create} disabled={creating}>
            {creating ? 'Создание…' : 'Создать'}
          </Button>
        </div>
        {err ? <div style={{ marginTop: 10, color: '#ff6b6b' }}>{err}</div> : null}
      </Card>

      {projects.length === 0 && !loading ? (
        <div style={{ opacity: 0.75, fontSize: 13, padding: 8 }}>Пока нет проектов. Создайте первый проект выше.</div>
      ) : null}

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {projects.map(p => (
          <Card key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 800 }}>{p.name}</div>
            {p.description ? <div style={{ opacity: 0.75, fontSize: 13 }}>{p.description}</div> : <div style={{ opacity: 0.45, fontSize: 13 }}>Без описания</div>}
            <div style={{ marginTop: 8 }}>
              <Button kind="primary" onClick={() => onOpenProject?.(p)}>
                Открыть канбан
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
