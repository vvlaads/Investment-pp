#include "quote_formatter.h"
#include <linux/kernel.h>

static ssize_t csv_format(const struct stock_quote *quote, char *buf,
                          size_t len) {
  /* Превращаем fixed-point обратно в понятный вид */
  u64 bid_int = quote->bid / 10000;
  u64 bid_frac = quote->bid % 10000;
  u64 ask_int = quote->ask / 10000;
  u64 ask_frac = quote->ask % 10000;

  /* Формируем CSV строку: Ticker,Bid,Ask,Volume,Timestamp\n */
  return snprintf(buf, len, "%s,%llu.%04llu,%llu.%04llu,%u,%llu\n",
                  quote->ticker, bid_int, bid_frac, ask_int, ask_frac,
                  quote->volume, quote->timestamp);
}

/* Экспортируем реализацию */
struct quote_formatter fmt_csv = {.name = "csv", .format = csv_format};