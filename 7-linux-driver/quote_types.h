#ifndef QUOTE_TYPES_H
#define QUOTE_TYPES_H

#include <linux/types.h>

/* Базовая структура котировки */
struct stock_quote {
    char ticker[8];      /* Тикер, например "AAPL\0" */
    u64 bid;             /* Цена покупки (fixed-point, 150.25 -> 1502500) */
    u64 ask;             /* Цена продажи */
    u32 volume;          /* Объем торгов */
    u64 timestamp;       /* Время в наносекундах */
};

#endif /* QUOTE_TYPES_H */