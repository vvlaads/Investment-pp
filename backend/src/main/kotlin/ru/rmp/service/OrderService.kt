package ru.rmp.service

import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.rmp.dto.OrderRequest
import ru.rmp.dto.OrderResponse
import ru.rmp.entity.Order
import ru.rmp.entity.OrderStatus
import ru.rmp.entity.OrderType
import ru.rmp.entity.PortfolioPosition
import ru.rmp.repository.InstrumentRepository
import ru.rmp.repository.OrderRepository
import ru.rmp.repository.PortfolioPositionRepository
import ru.rmp.repository.UserRepository
import java.math.BigDecimal

@Service
class OrderService(
    private val userRepository: UserRepository,
    private val instrumentRepository: InstrumentRepository,
    private val portfolioPositionRepository: PortfolioPositionRepository,
    private val orderRepository: OrderRepository,
    private val marketDataService: MarketDataService
) {
    @Transactional
    fun buy(userId: Long, req: OrderRequest): OrderResponse {
        if (req.quantity <= BigDecimal.ZERO)
            throw IllegalArgumentException("Количество должно быть положительным")
        val user = userRepository.findById(userId).orElseThrow { NoSuchElementException("User not found") }
        val instrument = instrumentRepository.findByTicker(req.ticker)
            ?: throw IllegalArgumentException("Инструмент не найден: ${req.ticker}")
        val price = marketDataService.currentPrice(req.ticker)
        val total = price.multiply(req.quantity)
        if (user.balance < total)
            throw IllegalArgumentException("Недостаточно средств. Баланс: ${user.balance}, требуется: $total")
        user.balance = user.balance.subtract(total)
        userRepository.save(user)
        var position = portfolioPositionRepository.findByUserIdAndInstrumentId(userId, instrument.id)
        if (position == null) {
            position = PortfolioPosition(user = user, instrument = instrument, quantity = BigDecimal.ZERO)
            position = portfolioPositionRepository.save(position)
        }
        val pos = position!!
        pos.quantity = pos.quantity.add(req.quantity)
        portfolioPositionRepository.save(pos)
        val order = Order(
            user = user,
            instrument = instrument,
            type = OrderType.BUY,
            quantity = req.quantity,
            price = price,
            status = OrderStatus.EXECUTED
        )
        val saved = orderRepository.save(order)
        return toResponse(saved)
    }

    @Transactional
    fun sell(userId: Long, req: OrderRequest): OrderResponse {
        if (req.quantity <= BigDecimal.ZERO)
            throw IllegalArgumentException("Количество должно быть положительным")
        val user = userRepository.findById(userId).orElseThrow { NoSuchElementException("User not found") }
        val instrument = instrumentRepository.findByTicker(req.ticker)
            ?: throw IllegalArgumentException("Инструмент не найден: ${req.ticker}")
        val position = portfolioPositionRepository.findByUserIdAndInstrumentId(userId, instrument.id)
            ?: throw IllegalArgumentException("Нет позиции по инструменту ${req.ticker}")
        if (position.quantity < req.quantity)
            throw IllegalArgumentException("Недостаточно бумаг. В портфеле: ${position.quantity}, запрошено: ${req.quantity}")
        val price = marketDataService.currentPrice(req.ticker)
        val total = price.multiply(req.quantity)
        user.balance = user.balance.add(total)
        userRepository.save(user)
        position.quantity = position.quantity.subtract(req.quantity)
        if (position.quantity.compareTo(BigDecimal.ZERO) == 0)
            portfolioPositionRepository.delete(position)
        else
            portfolioPositionRepository.save(position)
        val order = Order(
            user = user,
            instrument = instrument,
            type = OrderType.SELL,
            quantity = req.quantity,
            price = price,
            status = OrderStatus.EXECUTED
        )
        val saved = orderRepository.save(order)
        return toResponse(saved)
    }

    fun getHistory(userId: Long, limit: Int = 50): List<OrderResponse> {
        val page = PageRequest.of(0, limit.coerceAtLeast(1).coerceAtMost(200))
        return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId, page).map { toResponse(it) }
    }

    private fun toResponse(o: Order): OrderResponse = OrderResponse(
        id = o.id,
        ticker = o.instrument!!.ticker,
        type = o.type.name,
        quantity = o.quantity,
        price = o.price,
        status = o.status.name,
        createdAt = o.createdAt
    )
}
