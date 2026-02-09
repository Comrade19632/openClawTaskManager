# STATUS (TaskManager)

_Авто-обновление цикла: 2026-02-09 18:24 MSK_

## Текущее состояние
- UI: `/taskManager/` (логин через Telegram Login Widget)
- API: `/taskManager/api/health/` (ok)

## Что сделано (за цикл)
- Спринт разложен на техзадачи по ролям (см. `tasks/`):
  - FE: проекты/доска/DnD/drawer/метаданные карточки
  - BE: модели+миграции+DRF API (projects/tasks) + логика `closed_at`
  - OPS: деплой/смоук через nginx
- Обновлён TECH_DEBT (контракт FE/BE, ordering, .env hygiene, TokenAuth без expiry и т.д.)

## В работе
- FE: реализация UI проектов + канбан + **Drag&Drop** + показ `closed_at` на карточках Done/Today.
- BE: модели/миграции + эндпоинты для проектов/задач + смена статуса и фиксация `closed_at`.
- OPS: смоук/перезапуск compose после мерджа (когда появятся коммиты FE/BE).

## Риски / блокеры
- FE/BE контракт по статусам/эндпоинтам/ordering нужно согласовать (иначе переделка DnD).
- В корне репо есть локальный `.env` (в gitignore, но важно не допустить утечек/коммита).

## Следующие шаги
1) Дождаться коммитов FE/BE (реализация + тесты + push).
2) OPS: `docker compose up -d --build`, smoke-check через nginx.
3) PM: обновить SPRINT/STATUS финальным состоянием и критериями проверок.
