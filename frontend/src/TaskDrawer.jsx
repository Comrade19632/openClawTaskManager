import React, { useEffect, useMemo, useState } from 'react'
import { Button, Input, Overlay, TextArea } from './ui'

export function TaskDrawer({
  open,
  mode, // 'create' | 'edit'
  task,
  initialStatus,
  saving,
  error,
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [localErr, setLocalErr] = useState('')

  const header = mode === 'create' ? 'Новая задача' : 'Задача'

  useEffect(() => {
    if (!open) return
    setLocalErr('')
    setTitle(task?.title || '')
    setDescription(task?.description || '')
  }, [open, task])

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && !saving
  }, [title, saving])

  const submit = () => {
    setLocalErr('')
    if (!title.trim()) {
      setLocalErr('Введите заголовок задачи')
      return
    }
    onSubmit?.({ title: title.trim(), description: description || '', status: initialStatus })
  }

  return (
    <Overlay open={open} onClose={saving ? undefined : onClose}>
      <div
        style={{
          width: 'min(520px, 92vw)',
          height: '100%',
          background: '#0b0f14',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          padding: 18,
          overflow: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 750 }}>{header}</div>
          <Button disabled={saving} onClick={onClose}>
            ✕
          </Button>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Заголовок *</div>
            <Input value={title} onChange={setTitle} placeholder="Например: Подготовить отчёт" />
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Описание</div>
            <TextArea value={description} onChange={setDescription} placeholder="Подробности задачи (необязательно)" rows={6} />
          </div>

          {mode === 'edit' && task?.source ? (
            <div style={{ fontSize: 12, opacity: 0.75 }}>Источник: {task.source}</div>
          ) : null}

          {(localErr || error) ? <div style={{ color: '#ff6b6b', fontSize: 13 }}>{localErr || error}</div> : null}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <Button disabled={saving} onClick={onClose}>
              Отмена
            </Button>
            <Button kind="primary" disabled={!canSubmit} onClick={submit}>
              {saving ? 'Сохранение…' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </div>
    </Overlay>
  )
}
