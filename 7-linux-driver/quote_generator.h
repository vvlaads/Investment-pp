#ifndef QUOTE_GENERATOR_H
#define QUOTE_GENERATOR_H

#include "quote_types.h"

/* 
 * Интерфейс генератора котировок. 
 * Любой алгоритм должен реализовать эти функции.
 */
struct quote_generator {
    const char *name; /* Название алгоритма (например "random_walk") */
    
    /* Инициализация: выделение памяти, установка начальной цены */
    int (*init)(void **private_data, const char *ticker, u64 initial_price);
    
    /* Генерация следующего тика (записывается в out_quote) */
    int (*generate_next)(struct stock_quote *out_quote, void *private_data);
    
    /* Освобождение ресурсов */
    void (*cleanup)(void *private_data);
};

#endif /* QUOTE_GENERATOR_H */