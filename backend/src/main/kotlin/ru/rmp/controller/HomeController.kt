package ru.rmp.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class HomeController {

    @GetMapping("/")
    @ResponseBody
    fun home(): String {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><title>Инвестиции++ API</title></head>
            <body style="font-family: system-ui; max-width: 600px; margin: 2rem auto; padding: 0 1rem;">
                <h1>Инвестиции++</h1>
                <p>REST API запущен. Веб-интерфейса нет — используйте API или Postman/curl.</p>
                <h2>Эндпоинты</h2>
                <ul>
                    <li><strong>POST</strong> <a href="/api/auth/register">/api/auth/register</a> — регистрация (JSON: login, password)</li>
                    <li><strong>POST</strong> <a href="/api/auth/login">/api/auth/login</a> — вход</li>
                    <li><strong>GET</strong> <a href="/api/quotes">/api/quotes</a> — котировки (нужен заголовок Authorization: Bearer &lt;token&gt;)</li>
                    <li><strong>GET</strong> /api/portfolio — портфель</li>
                    <li><strong>POST</strong> /api/orders/buy — покупка (JSON: ticker, quantity)</li>
                    <li><strong>POST</strong> /api/orders/sell — продажа</li>
                    <li><strong>GET</strong> /api/orders/history — история операций</li>
                </ul>
                <p>Сначала зарегистрируйтесь или войдите, получите token, затем добавляйте заголовок <code>Authorization: Bearer &lt;token&gt;</code> к запросам.</p>
            </body>
            </html>
        """.trimIndent()
    }
}
