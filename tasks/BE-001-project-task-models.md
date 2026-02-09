# BE-001: Модели Project/Task + миграции

## Контекст
Сейчас в бэке есть только TelegramAccount и auth/token. Для канбана нужны сущности проектов и задач, привязанные к пользователю.

## Acceptance Criteria («Готово»)
- Добавлены модели (или эквивалент) и миграции:
  - `Project`: владелец (user), `name` (обяз.), `description` (опц.), timestamps.
  - `Task`: project (FK), `title` (обяз.), `description` (опц.), `status` (enum/choices для 5 колонок), `source` (строка), `closed_at` (datetime, nullable), timestamps.
- Значения статуса соответствуют колонкам: Queue / In Progress / Waiting / Done / Today (внутренние коды можно короткие, но стабильные).
- Бизнес-логика времени закрытия:
  - при переводе задачи в Done или Today — `closed_at` выставляется (если пусто) в текущее время.
  - при переводе из Done/Today обратно — `closed_at` очищается (или по договорённости остаётся; но поведение должно быть зафиксировано и покрыто тестом).
- Админка Django (optional, но желательно): Project/Task видны и фильтруются по owner/project.

## Как проверить
1. `python manage.py makemigrations && python manage.py migrate` проходит.
2. Через Django shell/admin создать Project/Task → убедиться, что статусы и closed_at работают как задумано.
3. Минимальные unit-тесты на смену статуса и closed_at зелёные.

## Риски / заметки
- Важно не «захардкодить» user через TelegramAccount: ownership должен быть по `request.user`.
- Нужно решить: хранить порядок задач в колонке (позиции) сейчас или позже; для MVP можно без сортировки.
