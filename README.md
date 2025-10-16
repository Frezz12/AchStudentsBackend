# Backend для мобильного приложения достижений студентов колледжа

Этот проект представляет собой backend API для мобильного приложения системы достижений студентов колледжа, построенный с использованием NestJS, TypeScript, SQLite и JWT авторизации.

## 🚀 Технологии

- **NestJS** - фреймворк для Node.js
- **TypeScript** - типизированный JavaScript
- **SQLite** - легковесная база данных
- **TypeORM** - ORM для работы с базой данных
- **JWT** - JSON Web Tokens для авторизации
- **bcryptjs** - хеширование паролей
- **class-validator** - валидация данных
- **UUID** - генерация уникальных идентификаторов

## 📦 Установка и запуск

1. **Установите зависимости:**

```bash
npm install
```

2. **Создайте файл `.env` в корне проекта:**

```env
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
DATABASE_PATH=database.sqlite
PORT=3000
NODE_ENV=development
```

3. **Запустите приложение в режиме разработки:**

```bash
npm run start:dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## 🔧 API Endpoints

### Авторизация (`/auth`)

#### POST `/auth/register`

Регистрация нового пользователя

```json
{
  "email": "student@example.com",
  "password": "password123",
  "firstname": "Иван",
  "lastname": "Иванов",
  "surname": "Иванович",
  "role": "student" // опционально, по умолчанию "student"
}
```

**Ответ:**

```json
{
  "user": {
    "id": 1,
    "uuid": "bccac1b7-faf7-40b8-9760-978b6e467329",
    "email": "student@example.com",
    "firstname": "Иван",
    "lastname": "Иванов",
    "surname": "Иванович",
    "role": "student",
    "createdAt": "2025-10-14T18:15:01.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/auth/login`

Вход в систему

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

#### GET `/auth/profile`

Получение профиля текущего пользователя (требует JWT токен)

### Пользователи (`/users`)

#### GET `/users`

Получение списка всех пользователей

- Query параметры:
  - `role` - фильтр по роли (student, curator, admin)

#### GET `/users/stats`

Статистика по пользователям

#### GET `/users/:id`

Получение пользователя по ID

#### GET `/users/uuid/:uuid`

Получение пользователя по UUID

#### PATCH `/users/:id`

Обновление пользователя (требует JWT токен)

#### DELETE `/users/:id`

Удаление пользователя (требует JWT токен)

### Достижения (`/achievements`)

#### POST `/achievements`

Создание нового достижения (требует JWT токен)

```json
{
  "title": "Отличная учеба",
  "description": "Получение отличных оценок в семестре",
  "starPoints": 100,
  "category": "academic",
  "iconUrl": "https://example.com/icon.png",
  "isActive": true
}
```

#### GET `/achievements`

Получение списка достижений

- Query параметры:
  - `category` - фильтр по категории (academic, sports, creative, social, leadership)
  - `search` - поиск по названию и описанию

#### GET `/achievements/:id`

Получение достижения по ID

#### GET `/achievements/uuid/:uuid`

Получение достижения по UUID

#### PATCH `/achievements/:id`

Обновление достижения (требует JWT токен)

#### DELETE `/achievements/:id`

Удаление достижения (требует JWT токен)

### Связи студент-достижение (`/student-achievements`)

#### POST `/student-achievements`

Создание связи студент-достижение (требует JWT токен)

```json
{
  "achievementId": 1,
  "notes": "Дополнительная информация",
  "evidenceUrl": "https://example.com/evidence.pdf"
}
```

#### GET `/student-achievements`

Получение списка связей

- Query параметры:
  - `studentId` - фильтр по студенту
  - `achievementId` - фильтр по достижению
  - `status` - фильтр по статусу (pending, approved, rejected)

#### GET `/student-achievements/stats/student/:studentId`

Статистика по достижениям студента

#### GET `/student-achievements/stats/achievement/:achievementId`

Статистика по достижению

#### GET `/student-achievements/:id`

Получение связи по ID

#### GET `/student-achievements/uuid/:uuid`

Получение связи по UUID

#### PATCH `/student-achievements/:id`

Обновление связи (требует JWT токен)

```json
{
  "status": "approved",
  "notes": "Одобрено куратором",
  "evidenceUrl": "https://example.com/evidence.pdf"
}
```

#### DELETE `/student-achievements/:id`

Удаление связи (требует JWT токен)

## 📊 Модели данных

### User (Пользователь)

- `id` - уникальный идентификатор
- `uuid` - UUID пользователя
- `firstname` - имя
- `lastname` - фамилия
- `surname` - отчество
- `email` - email (уникальный)
- `password` - хешированный пароль
- `role` - роль (student, curator, admin)
- `createdAt` - дата создания
- `updatedAt` - дата обновления

### Achievement (Достижение)

- `id` - уникальный идентификатор
- `uuid` - UUID достижения
- `title` - название
- `description` - описание
- `starPoints` - количество звездных очков
- `category` - категория (academic, sports, creative, social, leadership)
- `iconUrl` - URL иконки
- `isActive` - активно ли достижение
- `createdBy` - кто создал
- `createdAt` - дата создания
- `updatedAt` - дата обновления

### StudentAchievement (Связь студент-достижение)

- `id` - уникальный идентификатор
- `uuid` - UUID связи
- `student` - студент
- `achievement` - достижение
- `status` - статус (pending, approved, rejected)
- `notes` - заметки
- `evidenceUrl` - URL доказательства
- `approvedBy` - кто одобрил
- `createdAt` - дата создания
- `updatedAt` - дата обновления

## 👥 Роли пользователей

- **student** - студент (может получать достижения)
- **curator** - куратор (может одобрять/отклонять достижения)
- **admin** - администратор (полный доступ)

## 🔐 Авторизация

Все защищенные endpoints требуют JWT токен в заголовке:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Примеры использования

### Регистрация студента

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

### Получение достижений студента

```bash
curl -X GET "http://localhost:3000/student-achievements?studentId=1" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Создание достижения

```bash
curl -X POST http://localhost:3000/achievements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Отличная учеба",
    "description": "Получение отличных оценок в семестре",
    "starPoints": 100,
    "category": "academic"
  }'
```

## 🏗️ Разработка

### Структура проекта

```
src/
├── auth/                 # Модуль авторизации
│   ├── dto/             # DTO для валидации
│   ├── entities/        # Сущности (если нужны)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── users/                # Модуль пользователей
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── achievements/         # Модуль достижений
│   ├── dto/
│   ├── entities/
│   ├── achievements.controller.ts
│   ├── achievements.service.ts
│   └── achievements.module.ts
├── student-achievements/ # Модуль связей студент-достижение
│   ├── dto/
│   ├── student-achievement/
│   │   └── entities/
│   ├── student-achievements.controller.ts
│   ├── student-achievements.service.ts
│   └── student-achievements.module.ts
├── common/              # Общие компоненты
│   └── guards/
├── app.module.ts        # Главный модуль
└── main.ts              # Точка входа
```

### Команды

- `npm run start` - запуск в продакшене
- `npm run start:dev` - запуск в режиме разработки
- `npm run start:debug` - запуск в режиме отладки
- `npm run build` - сборка проекта
- `npm run test` - запуск тестов
- `npm run lint` - проверка кода

## ✅ Статус проекта

Все основные функции реализованы и протестированы:

- ✅ JWT авторизация (регистрация, логин)
- ✅ CRUD операции для пользователей
- ✅ CRUD операции для достижений
- ✅ Связи между студентами и достижениями
- ✅ Валидация данных
- ✅ Роли пользователей
- ✅ Статистика
- ✅ Поиск и фильтрация

## 🔧 Технические особенности

- **База данных**: SQLite с better-sqlite3 драйвером
- **Авторизация**: JWT токены с истечением через 24 часа
- **Валидация**: class-validator с глобальными пайпами
- **CORS**: Настроен для мобильных приложений
- **UUID**: Все сущности имеют UUID для внешних ссылок
- **Хеширование**: Пароли хешируются с помощью bcryptjs

## 📝 Лицензия

Этот проект создан для образовательных целей.

---

**Приложение успешно запущено и готово к использованию!** 🎉
