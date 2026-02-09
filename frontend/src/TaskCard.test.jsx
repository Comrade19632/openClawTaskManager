import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskCard } from './TaskCard'

describe('TaskCard', () => {
  it('shows 🤖 badge for clawdbot source', () => {
    render(<TaskCard task={{ id: 1, title: 'A', status: 'queue', source: 'clawdbot' }} />)
    expect(screen.getByText('🤖')).toBeInTheDocument()
  })

  it('shows closed time only for done/today', () => {
    const closed_at = '2026-02-09T15:26:00Z'
    const { rerender } = render(<TaskCard task={{ id: 1, title: 'A', status: 'done', closed_at }} />)
    expect(screen.getByTestId('closed-at')).toBeInTheDocument()

    rerender(<TaskCard task={{ id: 1, title: 'A', status: 'queue', closed_at }} />)
    expect(screen.queryByTestId('closed-at')).toBeNull()
  })
})
