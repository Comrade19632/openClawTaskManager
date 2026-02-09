# OPS-001: Проверка деплоя под /taskManager/ + smoke (UI + API)

## Контекст
Продукт развёрнут под префиксом `/taskManager/`. Нужно убедиться, что docker-compose/nginx (если есть) корректно проксирует фронт и API, и что базовые smoke-проверки описаны.

## Acceptance Criteria («Готово»)
- `docker-compose up` поднимает backend+frontend.
- Открытие `http(s)://<host>/taskManager/` показывает UI.
- `GET /taskManager/api/health/` → `{status: "ok"}`.
- Прописаны/проверены переменные окружения:
  - `TELEGRAM_BOT_TOKEN` (не коммитится в git),
  - `VITE_API_BASE` и `VITE_TG_BOT_USERNAME` (если нужны для окружений).
- В README добавлен (или актуализирован) раздел «Smoke check» (если его ещё нет).

## Как проверить
1. Поднять сервисы через compose.
2. Открыть `/taskManager/` в браузере.
3. Выполнить curl `.../taskManager/api/health/`.
4. Проверить, что секреты берутся из env и отсутствуют в репозитории.

## Риски / заметки
- Частая проблема: относительные пути и base href для Vite при деплое в поддиректории.
- Нужны CORS/CSRF настройки, если фронт и бэк на разных доменах (желательно держать под одним origin через proxy).
