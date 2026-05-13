# 5-connection-imitator — имитатор 10 000 мобильных клиентов

Нагрузочный имитатор для микросервиса БД ([4-DB-connection](../4-DB-connection/)). Поднимает заданное число виртуальных пользователей, которые регистрируются, авторизуются и совершают «случайные» действия:

- запрос котировок (`GET /api/quotes`);
- запрос портфеля (`GET /api/portfolio`);
- запрос истории операций (`GET /api/orders/history`);
- покупки/продажи (`POST /api/orders/{buy,sell}`).

GUI нет — это headless нагрузочный клиент. Метрики выводятся в stdout каждые `METRICS_INTERVAL_SECONDS` секунд (счётчики успехов и ошибок по типам).

---

## Стек

- Kotlin 1.9, JDK 17
- Kotlin Coroutines (Dispatchers.Default + один Job на каждого виртуального клиента)
- Ktor Client (CIO) с пулом соединений
- Jackson (kotlin + jsr310)
- Logback

---

## Запуск

### Вариант 1 — Docker Compose

Из корня репозитория:

```bash
cd docker
# поднимаем БД-сервис и постгрес/редис в фоне
docker compose up -d db-service
# запускаем имитатор (профиль "imitator")
docker compose --profile imitator up --build imitator
```

Параметры можно переопределять через env-переменные shell:

```bash
IMITATOR_CLIENTS=1000 IMITATOR_RAMP_UP=60 \
  docker compose --profile imitator up --build imitator
```

### Вариант 2 — Локально (Gradle 8.5+, JDK 17)

```bash
cd 5-connection-imitator
API_BASE_URL=http://localhost:8081 \
CLIENTS=500 \
RAMP_UP_SECONDS=30 \
DURATION_SECONDS=120 \
gradle run
```

Или собрать fat-jar:

```bash
gradle fatJar
java -jar build/libs/connection-imitator-*-all.jar
```

---

## Переменные окружения

| Переменная                | По умолчанию              | Описание                                              |
|---------------------------|---------------------------|-------------------------------------------------------|
| `API_BASE_URL`            | `http://localhost:8081`   | Базовый URL микросервиса БД                           |
| `CLIENTS`                 | `10000`                   | Количество виртуальных клиентов                       |
| `RAMP_UP_SECONDS`         | `60`                      | За какое время равномерно стартануть всех клиентов    |
| `DURATION_SECONDS`        | `0`                       | 0 = бесконечно, иначе — длительность теста в секундах |
| `THINK_MIN_MS`            | `500`                     | Минимальная пауза между действиями одного клиента     |
| `THINK_MAX_MS`            | `3000`                    | Максимальная пауза                                    |
| `WEIGHT_QUOTES`           | `0.45`                    | Доля запросов котировок                               |
| `WEIGHT_PORTFOLIO`        | `0.15`                    | Доля запросов портфеля                                |
| `WEIGHT_HISTORY`          | `0.15`                    | Доля запросов истории                                 |
| `WEIGHT_TRADE`            | `0.25`                    | Доля торговых операций (buy/sell)                     |
| `MAX_BUY_QTY`             | `5.0`                     | Верхняя граница случайного объёма заявки              |
| `LOGIN_PREFIX`            | `sim_`                    | Префикс логинов имитированных пользователей           |
| `CLIENT_PASSWORD`         | `Pa$$w0rd!`               | Пароль для всех имитированных пользователей           |
| `REQUEST_TIMEOUT_MS`      | `10000`                   | Таймаут HTTP-запросов                                 |
| `HTTP_CONCURRENCY`        | `2048`                    | Лимит соединений в пуле Ktor                          |
| `METRICS_INTERVAL_SECONDS`| `5`                       | Период вывода метрик в лог                            |

---

## Поведение виртуального клиента

1. Старт с задержкой `(rampUp / clients) * i` мс — чтобы 10к не вломились одной волной.
2. Регистрация (`/api/auth/register`). Если логин занят (`400`) — логин (`/api/auth/login`).
3. Случайный цикл действий с весами `WEIGHT_*` и паузой `THINK_MIN_MS..THINK_MAX_MS`.
4. Все ошибки HTTP агрегируются по статус-коду (`action.err.500`, `buy.err.400` и т.д.).
5. По завершении (Ctrl+C / истёк `DURATION_SECONDS`) выводится сводка.

Пример метрик:

```
[metrics] rate=412.4 req/s, delta={buy.ok=110, history.ok=130, portfolio.ok=140, quotes.items=23400, quotes.ok=1170, sell.ok=89},
          totals={auth.register.ok=10000, buy.ok=1900, ...}
```

---

## Зачем нужен

ТЗ требует «6.1 — система должна выдерживать одновременную работу не менее 10 000 пользователей при допустимой деградации обслуживания». Имитатор позволяет:

- проверять backend под целевой нагрузкой;
- ловить узкие места (пул соединений PostgreSQL, размер тред-пула Tomcat, размер пула HTTP);
- регрессионно гонять нагрузку перед релизом.
