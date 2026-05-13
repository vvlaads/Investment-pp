# 4-DB-connection — микросервис БД (Kotlin / Spring Boot 3)

Микросервис отвечает за работу с реляционной БД и кэшем, а также за бизнес-логику торговли:

- регистрация/аутентификация пользователей (JWT, BCrypt);
- хранение пользователей, инструментов, портфелей, истории операций (PostgreSQL);
- эмуляция рыночных котировок (фоновый тикер, кэширование в Redis);
- REST API для котировок, портфеля, ордеров (buy/sell), истории;
- глобальная обработка ошибок и CORS для мобильных клиентов и имитатора.

Сервис — самостоятельное приложение, не зависит от других модулей репозитория и общается с ними только по HTTP.

---

## Стек

- Kotlin 1.9, JDK 17
- Spring Boot 3.2 (Web, Data JPA, Data Redis, Security, Validation)
- PostgreSQL 16, Redis 7
- JWT (jjwt 0.12)
- Gradle 8.5

---

## Запуск

### Вариант 1 — Docker Compose (рекомендую)

Из корня репозитория:

```bash
cd docker
docker compose up --build db-service
```

Поднимется `postgres`, `redis` и сам `db-service` на `http://localhost:8081`. Состояние БД сохраняется в volume `postgres_data`.

Проверка живости:

```bash
curl http://localhost:8081/health
```

### Вариант 2 — Локально (нужен Gradle 8.5+ и JDK 17)

Подними PostgreSQL и Redis (например, через `docker compose up postgres redis` из `docker/`), затем:

```bash
cd 4-DB-connection
gradle bootRun
```

Параметры читаются из ENV (см. таблицу ниже) или из `src/main/resources/application.yml`.

### Переменные окружения

| Переменная        | По умолчанию | Описание                                |
|-------------------|--------------|-----------------------------------------|
| `SERVER_PORT`     | `8081`       | Порт HTTP                               |
| `POSTGRES_HOST`   | `localhost`  |                                         |
| `POSTGRES_PORT`   | `5432`       |                                         |
| `POSTGRES_DB`     | `investments`|                                         |
| `POSTGRES_USER`   | `postgres`   |                                         |
| `POSTGRES_PASSWORD`| `postgres`  |                                         |
| `REDIS_HOST`      | `localhost`  |                                         |
| `REDIS_PORT`      | `6379`       |                                         |
| `JWT_SECRET`      | (захардкожен в yml) | Должен быть минимум 32 символа    |
| `JWT_EXPIRATION_MS`| `86400000`  | Срок жизни токена (мс)                  |
| `MARKET_TICK_MS`  | `1000`       | Период фонового обновления котировок    |
| `DB_POOL_MAX`     | `50`         | Размер пула Hikari                      |
| `TOMCAT_THREADS_MAX`| `400`      | Лимит потоков Tomcat                    |

---

## API

Все ответы — JSON. Авторизация — `Authorization: Bearer <token>`.

### Открытые эндпоинты

| Метод | Путь                    | Описание                              |
|-------|-------------------------|---------------------------------------|
| GET   | `/health`               | Проверка живости                      |
| POST  | `/api/auth/register`    | Регистрация (`{login, password}`)     |
| POST  | `/api/auth/login`       | Вход (`{login, password}`)            |
| GET   | `/api/instruments`      | Справочник инструментов               |
| GET   | `/api/quotes`           | Все котировки                         |
| GET   | `/api/quotes/{ticker}`  | Котировка по тикеру                   |

### Требуют JWT

| Метод | Путь                          | Описание                                  |
|-------|-------------------------------|-------------------------------------------|
| GET   | `/api/portfolio`              | Баланс + позиции + суммарные активы       |
| POST  | `/api/orders/buy`             | Покупка (`{ticker, quantity}`)            |
| POST  | `/api/orders/sell`            | Продажа (`{ticker, quantity}`)            |
| GET   | `/api/orders/history?limit=N` | История операций (новые сверху, ≤200)     |

### Пример рабочего сценария

```bash
# регистрация
curl -s -X POST http://localhost:8081/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"login":"alice","password":"Pa$$w0rd!"}'
# {"token":"...","login":"alice"}

TOKEN="..."

# котировки
curl -s http://localhost:8081/api/quotes | head -c 300

# покупка
curl -s -X POST http://localhost:8081/api/orders/buy \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"ticker":"SBER","quantity":1.5}'

# портфель
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8081/api/portfolio
```

---

## Архитектура

```
controller/ -> service/ -> repository/ -> PostgreSQL
                       \-> MarketDataService -> Redis
```

- `MarketDataService` раз в `MARKET_TICK_MS` мс делает «случайное блуждание» цен в коридоре ±50% от базовой и пишет их в Redis (TTL 10 мин).
- В транзакциях покупки/продажи берётся `PESSIMISTIC_WRITE`-локзамок на пользователя → нет гонок по балансу при параллельных запросах от одного клиента.
- При первом старте `DataInitializer` создаёт справочник инструментов (8 тикеров RU-рынка).

---

## Сборка

```bash
gradle bootJar          # build/libs/investments-db-service-*.jar
docker build -t investments-db-service .
```

Healthcheck Docker-образа дёргает `/health` каждые 10 секунд.
