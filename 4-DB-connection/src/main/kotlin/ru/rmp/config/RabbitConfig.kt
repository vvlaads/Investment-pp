package ru.rmp.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RabbitConfig {

    @Bean
    fun quotesQueue(@Value("\${rabbitmq.quotes-queue:quotes-queue}") name: String): Queue =
        Queue(name, true)

    @Bean
    fun investmentExchange(@Value("\${rabbitmq.investment-exchange:investment-exchange}") name: String): DirectExchange =
        DirectExchange(name, true, false)

    @Bean
    fun investmentQueue(@Value("\${rabbitmq.investment-queue:investment-queue}") name: String): Queue =
        Queue(name, true)

    @Bean
    fun bindings(
        investmentQueue: Queue,
        investmentExchange: DirectExchange
    ): List<Binding> {
        val keys = listOf(
            "wallet.balance",
            "wallet.deposit",
            "wallet.withdraw",
            "stocks.list",
            "stocks.info",
            "stocks.buy",
            "stocks.sell",
            "users.get",
            "users.update",
            "users.delete",
            "users.stocks"
        )
        return keys.map { key ->
            BindingBuilder.bind(investmentQueue).to(investmentExchange).with(key)
        }
    }

    @Bean("amqpObjectMapper")
    fun amqpObjectMapper(): ObjectMapper = ObjectMapper()
        .registerKotlinModule()
        .registerModule(JavaTimeModule())

    @Bean
    fun jacksonMessageConverter(amqpObjectMapper: ObjectMapper): MessageConverter =
        Jackson2JsonMessageConverter(amqpObjectMapper)

    @Bean
    fun rabbitTemplate(
        connectionFactory: ConnectionFactory,
        converter: MessageConverter
    ): RabbitTemplate {
        val template = RabbitTemplate(connectionFactory)
        template.messageConverter = converter
        return template
    }
}
