import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

vi.mock('./api', () => {
  return {
    apiFetch: vi.fn(),
  }
})

import { apiFetch } from './api'
import { Board } from './Board'

function makeDt() {
  const store = new Map()
  return {
    dropEffect: 'move',
    effectAllowed: 'move',
    setData: (k, v) => store.set(k, v),
    getData: k => store.get(k) || '',
    clearData: k => (k ? store.delete(k) : store.clear()),
    files: [],
    items: [],
    types: Array.from(store.keys()),
  }
}

describe('Board', () => {
  it('renders 5 columns in Russian', async () => {
    apiFetch.mockResolvedValue([])
    render(<Board token="t" project={{ id: 1, name: 'P' }} />)

    await waitFor(() => expect(apiFetch).toHaveBeenCalled())

    expect(screen.getByText('Очередь')).toBeInTheDocument()
    expect(screen.getByText('В работе')).toBeInTheDocument()
    expect(screen.getByText('Ожидание')).toBeInTheDocument()
    expect(screen.getByText('Готово')).toBeInTheDocument()
    expect(screen.getByText('Сегодня')).toBeInTheDocument()
  })

  it('highlights column on drag over and clears highlight on drag leave', async () => {
    apiFetch.mockResolvedValue([])
    render(<Board token="t" project={{ id: 1, name: 'P' }} />)

    await waitFor(() => expect(apiFetch).toHaveBeenCalled())

    const col = screen.getByTestId('col-in_progress')

    const dt = makeDt()
    fireEvent.dragOver(col, { dataTransfer: dt })
    expect(col.getAttribute('style')).toContain('rgba(59, 130, 246, 0.08)')

    fireEvent.dragLeave(col, { relatedTarget: document.body })
    expect(col.getAttribute('style')).toContain('background: rgb(15, 20, 26)')
  })

  it('moves task between columns via drag&drop and calls API', async () => {
    const task = { id: 10, title: 'Задача', status: 'queue' }

    apiFetch.mockImplementation((path, opts = {}) => {
      const method = (opts.method || 'GET').toUpperCase()
      if (method === 'GET' && path === '/projects/1/tasks/') return Promise.resolve([task])
      if (method === 'PATCH' && path === `/tasks/${task.id}/`) return Promise.resolve({ ...task, status: 'in_progress' })
      return Promise.reject(new Error(`Unexpected apiFetch call: ${method} ${path}`))
    })

    render(<Board token="t" project={{ id: 1, name: 'P' }} />)

    await screen.findByText('Задача')

    const dt = makeDt()
    const card = screen.getAllByRole('button', { name: /задача/i })[0]

    fireEvent.dragStart(card, { dataTransfer: dt })
    expect(dt.getData('text/plain')).toBe(String(task.id))

    const boardGrid = card.closest('div[style*="grid-template-columns"]')
    expect(boardGrid).toBeTruthy()
    const column = boardGrid.querySelector('[data-testid="col-in_progress"]')
    expect(column).toBeTruthy()

    fireEvent.dragOver(column, { dataTransfer: dt })
    fireEvent.drop(column, { dataTransfer: dt })

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        `/tasks/${task.id}/`,
        expect.objectContaining({ method: 'PATCH', body: { status: 'in_progress' } })
      )
    })
  })
})
