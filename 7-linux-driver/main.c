#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/module.h>

#include "quote_generator.h"

/* Метаданные модуля */
MODULE_LICENSE("GPL");
MODULE_AUTHOR("Your Name");
MODULE_DESCRIPTION("Stock Quotes Simulator Kernel Module");
MODULE_VERSION("1.0");

/* Функция загрузки модуля (вызывается при insmod) */
static int __init quote_sim_init(void) {
  pr_info("Quote Simulator: Module starting up...\n");
  pr_info("Quote Simulator: Size of stock_quote is %zu bytes\n",
          sizeof(struct stock_quote));

  return 0;
}

/* Функция выгрузки модуля (вызывается при rmmod) */
static void __exit quote_sim_exit(void) {
  pr_info("Quote Simulator: Module exiting.\n");
}

/* Регистрация точек входа и выхода */
module_init(quote_sim_init);
module_exit(quote_sim_exit);