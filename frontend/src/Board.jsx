import React, { useMemo, useRef, useState } from 'react'
import { apiFetch } from './api'
import { STATUSES } from './constants'
import { safeErrorMessage } from './utils'
import { Button, Card } from './ui'
import { TaskCard } from './TaskCard'
import { TaskDrawer } from './TaskDrawer'

function groupByStatus(tasks) {
  const m = {}
  for (const s of STATUSES) m[s.id] = []
  for (const t of tasks || []) {
    const st = t.status || 'queue'
    if (!m[st]) m[st] = []
    m[st].push(t)
  }
  return m
}

export function Board({ token, project, onBack, onUnauthorized }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const [activeTask, setActiveTask] = useState(null)
  const [drawerMode, setDrawerMode] = useState('edit')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerStatus, setDrawerStatus] = useState('queue')
  const [drawerSaving, setDrawerSaving] = useState(false)
  const [drawerErr, setDrawerErr] = useState('')

  const [draggingId, setDraggingId] = useState(null)
  const [dragOverStatus, setDragOverStatus] = useState('')
  const savingIdsRef = useRef(new Set())

  const byStatus = useMemo(() => groupByStatus(tasks), [tasks])

  const load = async () => {
    setLoading(true)
    setErr('')
    try {
      const d = await apiFetch(`/projects/${project.id}/tasks/`, { token })
      setTasks(Array.isArray(d) ? d : d?.results || [])
    } catch (e) {
      if (e?.status === 401) onUnauthorized?.()
      setErr(safeErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id])

  const openCreate = status => {
    setDrawerMode('create')
    setActiveTask(null)
    setDrawerStatus(status || 'queue')
    setDrawerErr('')
    setDrawerOpen(true)
  }

  const openEdit = task => {
    setDrawerMode('edit')
    setActiveTask(task)
    setDrawerStatus(task?.status || 'queue')
    setDrawerErr('')
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    if (drawerSaving) return
    setDrawerOpen(false)
  }

  const submitDrawer = async ({ title, description, status }) => {
    setDrawerSaving(true)
    setDrawerErr('')
    try {
      if (drawerMode === 'create') {
        const created = await apiFetch(`/projects/${project.id}/tasks/`, {
          method: 'POST',
          token,
          body: { title, description, status: status || 'queue' },
        })
        setTasks(prev => [created, ...prev])
        setDrawerOpen(false)
      } else {
        const updated = await apiFetch(`/tasks/${activeTask.id}/`, {
          method: 'PATCH',
          token,
          body: { title, description },
        })
        setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))
        setDrawerOpen(false)
      }
    } catch (e) {
      if (e?.status === 401) onUnauthorized?.()
      setDrawerErr(safeErrorMessage(e))
    } finally {
      setDrawerSaving(false)
    }
  }

  const onDragStart = task => ev => {
    if (savingIdsRef.current.has(task.id)) {
      ev.preventDefault()
      return
    }
    setDraggingId(task.id)
    ev.dataTransfer.setData('text/plain', String(task.id))
    ev.dataTransfer.effectAllowed = 'move'
  }

  const dropToStatus = async (status, taskId) => {
    const t0 = tasks.find(t => String(t.id) === String(taskId))
    if (!t0) return
    if (t0.status === status) return

    // optimistic
    const prev = tasks
    const optimistic = prev.map(t => (String(t.id) === String(taskId) ? { ...t, status } : t))
    setTasks(optimistic)

    savingIdsRef.current.add(t0.id)
    try {
      const updated = await apiFetch(`/tasks/${t0.id}/`, {
        method: 'PATCH',
        token,
        body: { status },
      })
      setTasks(cur => cur.map(t => (t.id === updated.id ? updated : t)))
    } catch (e) {
      if (e?.status === 401) onUnauthorized?.()
      setErr(`Не удалось переместить задачу: ${safeErrorMessage(e)}`)
      setTasks(prev)
    } finally {
      savingIdsRef.current.delete(t0.id)
    }
  }

  const onDrop = status => async ev => {
    ev.preventDefault()
    setDragOverStatus('')
    const taskId = ev.dataTransfer.getData('text/plain')
    await dropToStatus(status, taskId)
    setDraggingId(null)
  }

  const onDragOver = status => ev => {
    ev.preventDefault()
    ev.dataTransfer.dropEffect = 'move'
    if (dragOverStatus !== status) setDragOverStatus(status)
  }

  const onDragEnd = () => {
    setDraggingId(null)
    setDragOverStatus('')
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Button onClick={onBack}>← Проекты</Button>
        <div style={{ fontSize: 16, fontWeight: 750, flex: 1 }}>Канбан: {project?.name || 'Проект'}</div>
        <Button onClick={load} disabled={loading} title="Перезагрузить">
          {loading ? 'Загрузка…' : 'Обновить'}
        </Button>
      </div>

      {err ? <div style={{ marginBottom: 12, color: '#ff6b6b' }}>Ошибка: {err}</div> : null}

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(5, minmax(220px, 1fr))', overflowX: 'auto' }}>
        {STATUSES.map(col => {
          const list = byStatus[col.id] || []
          const isOver = dragOverStatus === col.id
          return (
            <Card
              key={col.id}
              data-testid={`col-${col.id}`}
              onDragOver={onDragOver(col.id)}
              onDrop={onDrop(col.id)}
              style={{
                minHeight: 320,
                padding: 12,
                background: isOver ? 'rgba(59,130,246,0.08)' : '#0f141a',
                borderColor: isOver ? 'rgba(59,130,246,0.45)' : 'rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                <div style={{ fontWeight: 800, fontSize: 13 }}>
                  {col.title}
                  <span style={{ opacity: 0.6, fontWeight: 650 }}> · {list.length}</span>
                </div>
                <Button onClick={() => openCreate(col.id)} title="Добавить задачу">
                  +
                </Button>
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                {list.map(t => (
                  <div key={t.id} onDragEnd={onDragEnd}>
                    <TaskCard
                      task={t}
                      onClick={openEdit}
                      draggable
                      dragDisabled={savingIdsRef.current.has(t.id)}
                      onDragStart={onDragStart(t)}
                      isDragging={String(draggingId) === String(t.id)}
                    />
                  </div>
                ))}
                {list.length === 0 ? (
                  <div style={{ opacity: 0.55, fontSize: 12, padding: '6px 2px' }}>Перетащите сюда задачу или нажмите “+”.</div>
                ) : null}
              </div>
            </Card>
          )
        })}
      </div>

      <TaskDrawer
        open={drawerOpen}
        mode={drawerMode}
        task={activeTask}
        initialStatus={drawerStatus}
        saving={drawerSaving}
        error={drawerErr}
        onClose={closeDrawer}
        onSubmit={submitDrawer}
      />
    </div>
  )
}
