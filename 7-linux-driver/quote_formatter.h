#ifndef QUOTE_FORMATTER_H
#define QUOTE_FORMATTER_H

#include <linux/types.h>
#include "quote_types.h"

struct quote_formatter {
    const char *name;
    
    /* Функция преобразует структуру в строку текста. Возвращает длину строки. */
    ssize_t (*format)(const struct stock_quote *quote, char *buf, size_t len);
};

#endif /* QUOTE_FORMATTER_H */