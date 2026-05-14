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
import java.math.RoundingMode

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
        val quantity = normalizeQuantity(req.quantity)
        val user = userRepository.findByIdForUpdate(userId)
            .orElseThrow { NoSuchElementException("User not found") }
        val instrument = instrumentRepository.findByTicker(req.ticker)
            ?: throw IllegalArgumentException("Инструмент не найден: ${req.ticker}")
        val price = marketDataService.currentPrice(req.ticker)
        val total = price.multiply(quantity).setScale(4, RoundingMode.HALF_UP)
        if (user.balance < total)
            throw IllegalArgumentException("Недостаточно средств. Баланс: ${user.balance}, требуется: $total")
        user.balance = user.balance.subtract(total)
        userRepository.save(user)

        val existing = portfolioPositionRepository.findByUserIdAndInstrumentId(userId, instrument.id)
        val position = existing ?: PortfolioPosition(
            user = user,
            instrument = instrument,
            quantity = BigDecimal.ZERO,
            avgPrice = BigDecimal.ZERO
        )
        val oldQty = position.quantity
        val oldAvg = position.avgPrice
        val newQty = oldQty.add(quantity)
        val newAvg = if (newQty.signum() == 0) BigDecimal.ZERO
        else oldAvg.multiply(oldQty).add(price.multiply(quantity))
            .divide(newQty, 4, RoundingMode.HALF_UP)
        position.quantity = newQty
        position.avgPrice = newAvg
        portfolioPositionRepository.save(position)

        val order = Order(
            user = user,
            instrument = instrument,
            type = OrderType.BUY,
            quantity = quantity,
            price = price,
            status = OrderStatus.EXECUTED
        )
        return toResponse(orderRepository.save(order))
    }

    @Transactional
    fun sell(userId: Long, req: OrderRequest): OrderResponse {
        val quantity = normalizeQuantity(req.quantity)
        val user = userRepository.findByIdForUpdate(userId)
            .orElseThrow { NoSuchElementException("User not found") }
        val instrument = instrumentRepository.findByTicker(req.ticker)
            ?: throw IllegalArgumentException("Инструмент не найден: ${req.ticker}")
        val position = portfolioPositionRepository.findByUserIdAndInstrumentId(userId, instrument.id)
            ?: throw IllegalArgumentException("Нет позиции по инструменту ${req.ticker}")
        if (position.quantity < quantity)
            throw IllegalArgumentException("Недостаточно бумаг. В портфеле: ${position.quantity}, запрошено: $quantity")
        val price = marketDataService.currentPrice(req.ticker)
        val total = price.multiply(quantity).setScale(4, RoundingMode.HALF_UP)
        user.balance = user.balance.add(total)
        userRepository.save(user)

        position.quantity = position.quantity.subtract(quantity)
        if (position.quantity.compareTo(BigDecimal.ZERO) == 0) {
            portfolioPositionRepository.delete(position)
        } else {
            portfolioPositionRepository.save(position)
        }

        val order = Order(
            user = user,
            instrument = instrument,
            type = OrderType.SELL,
            quantity = quantity,
            price = price,
            status = OrderStatus.EXECUTED
        )
        return toResponse(orderRepository.save(order))
    }

    fun getHistory(userId: Long, limit: Int = 50): List<OrderResponse> {
        val page = PageRequest.of(0, limit.coerceAtLeast(1).coerceAtMost(200))
        return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId, page).map { toResponse(it) }
    }

    private fun normalizeQuantity(qty: BigDecimal): BigDecimal {
        if (qty <= BigDecimal.ZERO)
            throw IllegalArgumentException("Количество должно быть положительным")
        return qty.setScale(6, RoundingMode.HALF_UP)
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
