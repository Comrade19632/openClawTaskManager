// UI — на русском. Поле `id` используется как машинный статус.
export const STATUSES = [
  { id: 'queue', title: 'Очередь' },
  { id: 'in_progress', title: 'В работе' },
  { id: 'waiting', title: 'Ожидание' },
  { id: 'done', title: 'Готово' },
  { id: 'today', title: 'Сегодня' },
]

export function isClosedStatus(status) {
  return status === 'done' || status === 'today'
}
