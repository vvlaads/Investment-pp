# Connection App

This project is a middleware service that exposes a REST API for investment operations and forwards these requests to a RabbitMQ exchange for asynchronous processing.

## Features

Here's a list of features included in this project:

| Name | Description |
|------|-------------|
| [Dependency Injection](https://start.ktor.io/p/io.ktor/server-di) | Enables dependency injection for your server |
| [RabbitMQ](https://start.ktor.io/p/io.github.damirdenis-tudor/server-rabbitmq) | Adds RabbitMQ support to your application |
| [Content Negotiation](https://start.ktor.io/p/io.ktor/server-content-negotiation) | Provides automatic content conversion according to Content-Type and Accept headers |
| [Jackson](https://start.ktor.io/p/io.ktor/server-jackson) | Handles JSON serialization using Jackson library |
| [Authentication](https://start.ktor.io/p/io.ktor/server-auth) | Provides extension point for handling the Authorization header |
| [Authentication JWT](https://start.ktor.io/p/io.ktor/server-auth-jwt) | Handles JSON Web Token (JWT) bearer authentication scheme |
| [Swagger](https://start.ktor.io/p/io.ktor/server-swagger) | Serves Swagger UI for your project |
| [AsyncAPI](https://start.ktor.io/p/com.asyncapi/server-asyncapi) | Generates and serves AsyncAPI documentation |
| [CORS](https://start.ktor.io/p/io.ktor/server-cors) | Enables Cross-Origin Resource Sharing (CORS) |

## API Documentation

The service mirrors the Investment API. All requests are queued in RabbitMQ (`investment-exchange`) and returned with a "queued" status.

### Wallet Endpoints

#### Get Balance

`GET /wallet/balance`

- **Description**: Queues a request to retrieve the current wallet balance.
- **Response**: `200 OK` - "Balance request queued"

#### Deposit

`POST /wallet/deposit`

- **Body**: `{ "amount": number }`
- **Response**: `200 OK` - `{ "success": true, "message": "Депозит в очереди" }`

#### Withdraw

`POST /wallet/withdraw`

- **Body**: `{ "amount": number }`
- **Response**: `200 OK` - `{ "success": true, "message": "Снятие в очереди" }`

### Stocks Endpoints

#### List Stocks

`GET /stocks/list?page=1&limit=20`

- **Description**: Queues a request to list available stocks.
- **Response**: `200 OK` - "Stocks list request queued"

#### Stock Info

`GET /stocks?ticker=AAPL&beginDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

- **Description**: Queues a request for detailed information about a specific stock.
- **Response**: `200 OK` - "Stock info request queued"

#### Buy Stock

`POST /stocks/buy`

- **Body**: `{ "ticker": string, "quantity": number, "price": number }`
- **Response**: `200 OK` - `{ "status": "success", "message": "Покупка акций в очереди" }`

#### Sell Stock

`POST /stocks/sell`

- **Body**: `{ "ticker": string, "quantity": number, "price": number }`
- **Response**: `200 OK` - `{ "status": "success", "message": "Продажа акций в очереди" }`

## Building & Running

To build or run the project, use one of the following tasks:

| Task | Description |
|------|-------------|

If the server starts successfully, you'll see the following output:

```
2024-12-04 14:32:45.584 [main] INFO  Application - Application started in 0.303 seconds.
2024-12-04 14:32:45.682 [main] INFO  Application - Responding at http://0.0.0.0:8080
```
