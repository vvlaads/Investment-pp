# Инвестиции++ — система мобильного инвестирования

Реализация по ТЗ: регистрация/аутентификация, эмуляция рыночных данных, котировки, портфель, операции покупки/продажи, история операций.

## Стек

- **Backend:** Kotlin, Spring Boot 3, JPA (PostgreSQL), Redis, JWT
- **Запуск:** Docker Compose (PostgreSQL, Redis, приложение)

## Быстрый старт (Docker Compose)

1. Установи [Docker](https://docs.docker.com/get-docker/) и [Docker Compose](https://docs.docker.com/compose/install/).

2. Собери и запусти сервисы:

```bash
cd /Users/semenmolodicenko/Desktop/RMP
docker compose build
docker compose up -d
```

3. Дождись старта (около 30–60 сек). Бэкенд будет доступен по адресу: **http://localhost:8080**

## Запуск без Docker (локально)

1. Установи **Java 17**, **PostgreSQL 16**, **Redis 7**.

2. Создай БД и пользователя:

```bash
createdb investments
# или в psql: CREATE DATABASE investments;
```

3. Запусти Redis (например: `redis-server`).

4. Собери и запусти бэкенд:

```bash
cd backend
gradle bootRun
```

Либо с явными переменными окружения:

```bash
export POSTGRES_HOST=localhost POSTGRES_PORT=5432 POSTGRES_DB=investments POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres
export REDIS_HOST=localhost REDIS_PORT=6379
gradle bootRun
```

## Тестирование API

Ниже примеры вызовов через `curl`. Токен после логина подставляй в заголовок `Authorization: Bearer <token>`.

### 1. Регистрация

```bash
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"login":"user1","password":"password123"}' | jq
```

Ответ: `{"token":"...", "login":"user1"}`. Сохрани `token`.

### 2. Вход

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"user1","password":"password123"}' | jq
```

### 3. Котировки (без токена)

```bash
curl -s http://localhost:8080/api/quotes | jq
curl -s http://localhost:8080/api/quotes/SBER | jq
```

### 4. Портфель (нужен токен)

```bash
export TOKEN="<вставь_сюда_токен>"
curl -s http://localhost:8080/api/portfolio -H "Authorization: Bearer $TOKEN" | jq
```

### 5. Покупка

```bash
curl -s -X POST http://localhost:8080/api/orders/buy \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ticker":"SBER","quantity":10}' | jq
```

### 6. Продажа

```bash
curl -s -X POST http://localhost:8080/api/orders/sell \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ticker":"SBER","quantity":5}' | jq
```

### 7. История операций

```bash
curl -s "http://localhost:8080/api/orders/history?limit=20" -H "Authorization: Bearer $TOKEN" | jq
```

## Данные при первом запуске

- В БД создаются инструменты: GAZP, SBER, LKOH, YNDX, ROSN, GMKN, NVTK, PLZL.
- Котировки эмулируются (значения зависят от тикера и времени).
- Новому пользователю при регистрации начисляется стартовый баланс **100 000** (условных единиц).

## Остановка

```bash
docker compose down
```

Сброс данных (БД и т.п.):

```bash
docker compose down -v
```

"token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ1c2VyMSIsInVzZXJJZCI6MiwiaWF0IjoxNzcxNTE3OTM1LCJleHAiOjE3NzE2MDQzMzV9.nw_50v8uNNg-xN5wrjZ5a5-AXg3JA7KGy6RO3fT-v4bsALHvL1iu8FcffDlqIomL"


"login":"user1"
