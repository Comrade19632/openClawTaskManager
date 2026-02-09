import React from 'react'

export function Card({ children, style, ...rest }) {
  return (
    <div
      {...rest}
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

export function TopBar({ title, right }) {
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

export function Button({ children, onClick, kind = 'default', disabled, title, ...rest }) {
  const bg = kind === 'primary' ? '#3b82f6' : 'rgba(255,255,255,0.06)'
  const border = kind === 'primary' ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.10)'
  return (
    <button
      {...rest}
      title={title}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 10,
        padding: '8px 12px',
        background: disabled ? 'rgba(255,255,255,0.03)' : bg,
        color: disabled ? 'rgba(230,237,243,0.45)' : '#e6edf3',
        border: `1px solid ${border}`,
      }}
    >
      {children}
    </button>
  )
}

export function Input({ value, onChange, placeholder, style, ...rest }) {
  return (
    <input
      {...rest}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        color: '#e6edf3',
        borderRadius: 10,
        padding: '10px 12px',
        outline: 'none',
        ...style,
      }}
    />
  )
}

export function TextArea({ value, onChange, placeholder, style, rows = 5, ...rest }) {
  return (
    <textarea
      {...rest}
      rows={rows}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        color: '#e6edf3',
        borderRadius: 10,
        padding: '10px 12px',
        outline: 'none',
        resize: 'vertical',
        ...style,
      }}
    />
  )
}

export function Overlay({ open, onClose, children }) {
  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose?.()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {children}
    </div>
  )
}
