export const STATUSES = [
  { id: 'queue', title: 'Queue', ru: 'Очередь' },
  { id: 'in_progress', title: 'In Progress', ru: 'В работе' },
  { id: 'waiting', title: 'Waiting', ru: 'Ожидание' },
  { id: 'done', title: 'Done', ru: 'Готово' },
  { id: 'today', title: 'Today', ru: 'Сегодня' },
]

export function isClosedStatus(status) {
  return status === 'done' || status === 'today'
}
