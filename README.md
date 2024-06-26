# Документация

### Disclaimer

- В описании не было сказано о количестве товаров при обновлении списка товаров в локации, поэтому запрос был расширен данными о количестве товаров при внесении изменений
- ID товара упоминается дважды в разных форматах, поэтому не удалось до конца понять какой формат более подходящий для использования в базе данных. Для упрощения был выбран строковый формат с размером, но в реальном приложении будет уместней создавать отдельную сущность `Size` и отдельного числового ID товара. При таком подходе будет проще отслеживать товарные запасы
- В реальном приложении рекомендуется записывать логи в отдельную базу данных. Такой подход поможет сконцентрировать ресурсы базы данных на реализации основных бизнес задач

### Development

Для локальной разработки в корне проекта необходимо выполнить команды:

- `docker compose -f ./docker-compose-dev.yml up -d` - для запуска локально сервера MySQL v8
- `npm i` - для установки всех зависимостей
- `npm run dev:live` - для запуска приложения в режиме наблюдения за файлами проекта
- `npm run seeder:run` - для наполнения пустой базы тестовыми данными

Миграции должны примениться при запуске приложения (не рекомендуется использовать в продакшене), также доступны команды для управления данными

- `npm run migrate:generate` - генерирует новый файл миграции у учетом текущего состояния БД
- `npm run migrate:run` - применяет новые миграции
- `npm run migrate:revert` - отменяет изменения последней миграции
- `npm run seeder:revert` - наполняет базу тестовыми данными с учетом связей

### Staging

Режим staging имитирует реальную работу с данными и предназначен для взаимодействия с пользователем системы. Команды для управления данными недоступны в этом режиме. Для запуска в режиме staging необходимо выполнить команды:

- `docker compose -f ./docker-compose-stage.yml up -d` - данная команда соберет образ приложения, запустит сервер MySQL, запустит контейнер бэкенда после запуска БД

### Testing

Для проверки кода сервиса использовать команды:

- `npm run dev:check` - для проверки статической типизации без компиляции
- `npm run dev:watch` - для проверки статической типизации без компиляции в режиме наблюдения за файлами сервиса
- `npm run dev:lint` - для запуска проверок линтера
- `npm run dev:format` - для запуска проверок линтера и автоматического исправления ошибок (не все правила поддерживают автоматическое исправление)

### Служебные команды

- `npm run dev:upgrade` - для автоматического обновления npm зависимостей до последних версий
- `npm run bundle:clear` - сбрасывает последнюю сборку проекта
- `npm run bundle:compile` - сбрасывает последнюю сборку проекта и создает новую
- `npm run bundle:run` - запускает последнюю сборку проекта
