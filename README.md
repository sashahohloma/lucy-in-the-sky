# Комментарий к тестовому заданию

### Disclaimer

- В описании не было сказано о количестве товаров при обновлении списка товаров в локации, поэтому запрос был расширен данными о количестве товаров при внесении изменений
- ID товара упоминается дважды в разных форматах, поэтому не удалось до конца понять какой формат более подходящий для использования в базе данных. Для упрощения был выбран строковый формат с размером, но в реальном приложении будет уместней создавать отдельную сущность `Size` и отдельного числового ID товара. При таком подходе будет проще отслеживать товарные запасы
- В реальном приложении рекомендуется записывать логи в отдельную базу данных. Такой подход поможет сконцентрировать ресурсы базы данных на реализации основных бизнес задач

### Запуск