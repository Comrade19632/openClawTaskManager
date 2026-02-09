# BE-003: Усиление auth/permissions + стабильность /me и dev_login

## Контекст
Уже есть Telegram login → DRF TokenAuth. Нужно убедиться, что:
- все новые эндпоинты защищены токеном,
- `/me/` стабилен,
- dev_login не протечёт в прод.

## Acceptance Criteria («Готово»)
- Все эндпоинты кроме `/health/` и `/auth/telegram/` требуют аутентификацию.
- `/me/` возвращает 200 для валидного токена и 401 для отсутствующего/невалидного.
- `dev_login`:
  - доступен только при `DJANGO_DEBUG=1` и только с localhost (как сейчас) — добавить тест/комментарий в коде, чтобы не сломали случайно.
  - (опционально) полностью выключен в production settings.
- Добавлены/обновлены настройки DRF (DEFAULT_AUTHENTICATION_CLASSES/DEFAULT_PERMISSION_CLASSES) чтобы новые viewsets не забывали про permissions.

## Как проверить
1. Без токена вызвать защищённый эндпоинт → 401.
2. С токеном → 200.
3. Проверить, что dev_login отдаёт 403 не с localhost и при `DJANGO_DEBUG!=1`.

## Риски / заметки
- Если сейчас используются function-based views, переход на viewsets/routers должен сохранить permissions.
- TokenAuth без срока жизни — для MVP ок, но это потенциальный future tech debt.
