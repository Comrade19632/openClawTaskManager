# STATUS (TaskManager)

## Текущее состояние
- UI: `/taskManager/` (логин через Telegram Login Widget)
- API: `/taskManager/api/health/` (ok)

## Последние изменения
- eafdfbd docs: добавлены PRD + файлы процесса (STATUS/SPRINT/BACKLOG/TECH_DEBT)
- 272b2e6–6689733: Telegram Login Widget auth + базовые экраны UI; стабильная работа под `/taskManager/`

## Риски / блокеры
- В спринте пока нет разложенных техзадач по ролям (tasks/*.md пусто) → риск простоя команды.
- Канбан/проекты описаны в PRD, но модели/эндпоинты/UX ещё не закреплены в acceptance criteria.

## Дальше (ближайшие шаги)
1) TeamLead: разложить SPRINT на FE/BE/OPS задачи в `tasks/*.md` с AC + "как проверить".
2) BE: проекты + задачи (CRUD) + статусы/колонки, эндпоинты для канбана.
3) FE: проекты (list/create) + board UI + drawer редактирования + перенос задач между колонками.
