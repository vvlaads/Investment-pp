#include <linux/kernel.h>
#include <linux/random.h>
#include <linux/slab.h>
#include <linux/string.h>
#include "quotes_generator.h"

#define PRICE_SCALE 1000000LL

static struct financial_instrument initial_instruments[] = {
    {"EUR/USD", 1085000, 1085000, 1085100, 1000000, true},
    {"BTC/USD", 43250000000LL, 43250000000LL, 43251000000LL, 100, true},
    {"AAPL", 178500000, 178500000, 178510000, 500000, true},
    {"GOLD", 2034800000, 2034800000, 2034900000, 10000, true},
    {"SBER", 285500000, 285500000, 285510000, 200000, true},
};

void quotes_generator_init(void) {
    g_num_instruments = ARRAY_SIZE(initial_instruments);
    for (int i = 0; i < g_num_instruments; i++) {
        memcpy(&g_instruments[i], &initial_instruments[i], sizeof(struct financial_instrument));
    }
}

void quotes_generator_update(void) {
    if (!g_generation_enabled) return;

    for (int i = 0; i < g_num_instruments; i++) {
        if (!g_instruments[i].active) continue;

        g_instruments[i].last_bid = g_instruments[i].current_bid;

        /* Random walk: 0.1% to 2.0% */
        long long volatility_basis = 10 + (get_random_u32() % 191);
        long long change = (g_instruments[i].current_bid * volatility_basis) / 10000;

        if (get_random_u32() % 2) {
            g_instruments[i].current_bid += change;
        } else {
            g_instruments[i].current_bid -= change;
        }

        long long spread = (g_instruments[i].current_bid * 10) / 100000;
        if (spread < 100) spread = 100;
        g_instruments[i].current_ask = g_instruments[i].current_bid + spread;

        g_instruments[i].volume += (get_random_u32() % 1000);
    }
}

void quotes_generator_generate_quote(struct financial_instrument *inst, struct financial_quote *quote) {
    strncpy(quote->symbol, inst->symbol, SYMBOL_LEN);
    quote->bid = inst->current_bid;
    quote->ask = inst->current_ask;
    quote->spread = inst->current_ask - inst->current_bid;
    quote->timestamp = ktime_get();
    quote->volume = inst->volume;

    if (inst->last_bid != 0) {
        quote->change_percent = ((inst->current_bid - inst->last_bid) * 1000000) / inst->last_bid;
    } else {
        quote->change_percent = 0;
    }
}
