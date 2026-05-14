package ru.rmp.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
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
    fun jacksonMessageConverter(): MessageConverter {
        val mapper = ObjectMapper().registerKotlinModule()
        return Jackson2JsonMessageConverter(mapper)
    }

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
