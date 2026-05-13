package imitator

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicLong

class Metrics {
    private val counters = ConcurrentHashMap<String, AtomicLong>()

    fun inc(name: String, by: Long = 1L) {
        counters.computeIfAbsent(name) { AtomicLong(0) }.addAndGet(by)
    }

    fun snapshot(): Map<String, Long> = counters.mapValues { it.value.get() }.toSortedMap()

    fun diff(prev: Map<String, Long>): Map<String, Long> {
        val cur = snapshot()
        return cur.mapValues { (k, v) -> v - (prev[k] ?: 0L) }
    }
}
