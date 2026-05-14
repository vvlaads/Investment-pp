#ifndef QUOTES_DATA_H
#define QUOTES_DATA_H

#include <linux/types.h>
#include <linux/ktime.h>

#define MAX_SYMBOLS 10
#define SYMBOL_LEN 16

typedef enum {
    FORMAT_JSON,
    FORMAT_CSV
} output_format_t;

struct financial_instrument {
    char symbol[SYMBOL_LEN];
    long long current_bid;
    long long last_bid;
    long long current_ask;
    unsigned long volume;
    bool active;
};

struct financial_quote {
    char symbol[SYMBOL_LEN];
    long long bid;
    long long ask;
    long long spread;
    ktime_t timestamp;
    unsigned long volume;
    long long change_percent;
};

/* Global configuration and state */
extern output_format_t g_output_format;
extern unsigned int g_update_interval_ms;
extern bool g_generation_enabled;
extern struct financial_instrument g_instruments[MAX_SYMBOLS];
extern int g_num_instruments;

#endif /* QUOTES_DATA_H */
