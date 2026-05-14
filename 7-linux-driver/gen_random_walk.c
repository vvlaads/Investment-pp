#include "quote_generator.h"
#include <linux/ktime.h>  /* Для ktime_get_real_ns() */
#include <linux/random.h> /* Для get_random_u32() */
#include <linux/slab.h>   /* Для kmalloc / kfree */
#include <linux/string.h> /* Для strncpy */

/* Внутреннее (приватное) состояние алгоритма */
struct rw_state {
  char ticker[8];
  u64 current_price;
};

/* 1. Функция инициализации */
static int rw_init(void **private_data, const char *ticker, u64 initial_price) {
  struct rw_state *state;

  /* Выделяем память.*/
  state = kmalloc(sizeof(*state), GFP_KERNEL);
  if (!state)
    return -ENOMEM; /* Ошибка: нет памяти */

  /* Копируем тикер */
  strncpy(state->ticker, ticker, sizeof(state->ticker) - 1);
  state->ticker[sizeof(state->ticker) - 1] = '\0';

  state->current_price = initial_price;
  *private_data = state; /* Сохраняем состояние для будущих вызовов */

  return 0;
}

/* 2. Функция генерации тика */
static int rw_generate_next(struct stock_quote *out_quote, void *private_data) {
  struct rw_state *state = (struct rw_state *)private_data;
  u32 rand_val;
  long delta;

  if (!state || !out_quote)
    return -EINVAL;

  /* Генерируем изменение цены: от -500 до +500 (в fixed point это от -0.05 до
   * +0.05) */
  rand_val = get_random_u32() % 1001; /* Число 0..1000 */
  delta = (long)rand_val - 500;       /* Сдвигаем: -500..+500 */

  /* Обновляем цену, не даем ей упасть ниже нуля */
  if (delta < 0 && state->current_price < (u64)(-delta)) {
    state->current_price = 1000; /* Дно */
  } else {
    state->current_price += delta;
  }

  /* Заполняем выходную структуру */
  strncpy(out_quote->ticker, state->ticker, sizeof(out_quote->ticker));
  out_quote->bid = state->current_price - 100; /* Спред 0.01 (100) */
  out_quote->ask = state->current_price + 100;
  out_quote->volume =
      (get_random_u32() % 100) + 1; /* Объем от 1 до 100 лотов */
  out_quote->timestamp = ktime_get_real_ns(); /* Текущее время в наносекундах */

  return 0;
}

/* 3. Функция очистки */
static void rw_cleanup(void *private_data) {
  if (private_data) {
    kfree(private_data);
  }
}

/* Экспортируем реализацию в виде структуры */
struct quote_generator gen_random_walk = {.name = "random_walk",
                                          .init = rw_init,
                                          .generate_next = rw_generate_next,
                                          .cleanup = rw_cleanup};