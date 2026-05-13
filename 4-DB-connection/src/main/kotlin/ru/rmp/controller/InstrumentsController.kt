package ru.rmp.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rmp.dto.InstrumentResponse
import ru.rmp.repository.InstrumentRepository

@RestController
@RequestMapping("/api/instruments")
class InstrumentsController(private val instrumentRepository: InstrumentRepository) {

    @GetMapping
    fun list(): List<InstrumentResponse> =
        instrumentRepository.findAll().map { InstrumentResponse(it.ticker, it.name) }
}
