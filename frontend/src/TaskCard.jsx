import React from 'react'
import { Card } from './ui'
import { formatDateTimeShort } from './utils'
import { isClosedStatus } from './constants'

export function TaskCard({ task, onClick, draggable, onDragStart, dragDisabled, isDragging }) {
  const closedAt = task?.closed_at || task?.done_at
  const showClosed = isClosedStatus(task?.status) && !!closedAt

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(task)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.(task)
      }}
      draggable={draggable && !dragDisabled}
      onDragStart={dragDisabled ? undefined : onDragStart}
      style={{
        padding: 12,
        cursor: 'pointer',
        background: isDragging ? 'rgba(59,130,246,0.10)' : 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 650, lineHeight: 1.25 }}>{task?.title || 'Без названия'}</div>
        {task?.source === 'clawdbot' ? (
          <div
            title="Создано ботом"
            style={{
              fontSize: 12,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              opacity: 0.95,
              whiteSpace: 'nowrap',
            }}
          >
            🤖
          </div>
        ) : null}
      </div>

      {task?.description ? (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75, lineHeight: 1.35, whiteSpace: 'pre-wrap' }}>
          {task.description}
        </div>
      ) : null}

      {showClosed ? (
        <div
          data-testid="closed-at"
          style={{
            marginTop: 10,
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: 11,
            opacity: 0.7,
          }}
        >
          {formatDateTimeShort(closedAt)}
        </div>
      ) : null}
    </Card>
  )
}
