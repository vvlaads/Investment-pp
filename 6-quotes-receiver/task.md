# Задача: Создать микросервис на Go для чтения котировок из драйвера Linux

## Контекст

Есть драйвер Linux `/dev/financial_quotes`, который при чтении возвращает JSON с текущими котировками. Нужен простой HTTP-сервис на Go, который читает данные из драйвера и отдаёт их через REST API.

## Модель данных

```go
type Quote struct {
    Symbol        string  `json:"symbol"`
    Bid           float64 `json:"bid"`
    Ask           float64 `json:"ask"`
    Spread        float64 `json:"spread"`
    Timestamp     int64   `json:"timestamp"`
    Volume        int64   `json:"volume"`
    ChangePercent float64 `json:"change_percent"`
}
```

## REST API эндпоинты

```text
GET  /api/v1/quotes              — все текущие котировки
GET  /api/v1/quotes/{symbol}     — котировка по тикеру
GET  /api/v1/health              — проверка здоровья
```

### Логика работы сервиса

- При старте запускается горутина, которая раз в 100 мс читает /dev/financial_quotes
- Полученный JSON парсится в слайс []Quote
- Данные сохраняются в потокобезопасное in-memory хранилище
- REST API отдаёт последние данные из хранилища
- При остановке сервиса горутина корректно завершается (graceful shutdown)

### Технические требования

Стандартная библиотека Go + github.com/gorilla/mux для роутинга
Конфигурация через флаги командной строки:

-port — HTTP порт (по умолчанию 8080)
-driver — путь к устройству (по умолчанию /dev/financial_quotes)
-interval — интервал чтения в миллисекундах (по умолчанию 100)
In-memory хранилище с sync.RWMutex для потокобезопасности
Логирование в stdout (обычный log пакет)
CORS заголовки для всех эндпоинтов (Access-Control-Allow-Origin: *)

### Примеры ответов API

GET `/api/v1/quotes`

```json
{
  "data": [
    {
      "symbol": "EUR/USD",
      "bid": 1.0850,
      "ask": 1.0852,
      "spread": 0.0002,
      "timestamp": 1700000000000000000,
      "volume": 1500,
      "change_percent": 0.15
    }
  ]
}
```

GET `/api/v1/health`

```json
{
  "status": "ok",
  "driver_connected": true
}
```
