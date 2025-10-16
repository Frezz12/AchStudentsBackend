# Быстрый старт

## 1. Установка зависимостей

```bash
npm install
```

## 2. Запуск приложения

```bash
npm run start:dev
```

## 3. Тестирование API

### Регистрация пользователя

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "firstname": "Иван",
    "lastname": "Иванов",
    "surname": "Иванович"
  }'
```

### Вход в систему

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Создание достижения (замените TOKEN на полученный JWT токен)

```bash
curl -X POST http://localhost:3000/achievements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Отличная учеба",
    "description": "Получение отличных оценок в семестре",
    "starPoints": 100,
    "category": "academic"
  }'
```

### Получение списка достижений

```bash
curl -X GET http://localhost:3000/achievements
```

## 4. Основные endpoints

- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /auth/profile` - Профиль (требует токен)
- `GET /achievements` - Список достижений
- `POST /achievements` - Создание достижения (требует токен)
- `GET /student-achievements` - Связи студент-достижение
- `POST /student-achievements` - Создание связи (требует токен)

Приложение будет доступно по адресу: http://localhost:3000
