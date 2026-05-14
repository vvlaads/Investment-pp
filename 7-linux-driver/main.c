#include <linux/device.h>
#include <linux/fs.h>
#include <linux/init.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>
#include <linux/kfifo.h>
#include <linux/module.h>
#include <linux/spinlock.h>
#include <linux/timer.h>
#include <linux/uaccess.h>
#include <linux/version.h>
#include <linux/wait.h>

#include "quote_formatter.h"
#include "quote_generator.h"

MODULE_LICENSE("GPL");

/* --- Внешние зависимости --- */
extern struct quote_generator gen_random_walk;
extern struct quote_formatter fmt_csv;

static struct quote_generator *current_gen = &gen_random_walk;
static struct quote_formatter *current_fmt = &fmt_csv;
static void *gen_private_data = NULL;

/* --- Настройки Таймера --- */
static struct timer_list quote_timer;
static unsigned int timer_interval_ms = 500; /* Генерируем 2 раза в секунду */

/* --- Инфраструктура Символьного Устройства --- */
#define DEVICE_NAME "quotes"
#define CLASS_NAME "quote_sim"
static int major_number;
static struct class *quote_class = NULL;
static struct device *quote_device = NULL;

/* --- Синхронизация и Буфер --- */
#define FIFO_SIZE 128
static DEFINE_KFIFO(quote_fifo, struct stock_quote, FIFO_SIZE);
static DEFINE_SPINLOCK(fifo_lock);
static DECLARE_WAIT_QUEUE_HEAD(quote_waitqueue);

/* =========================================================================
 * ФАЗА 1: ГЕНЕРАЦИЯ ДАННЫХ
 * ========================================================================= */
static void timer_callback(struct timer_list *t) {
  struct stock_quote quote;

  if (current_gen && current_gen->generate_next) {
    if (current_gen->generate_next(&quote, gen_private_data) == 0) {

      /* Кладем данные в кольцевой буфер */
      spin_lock(&fifo_lock);
      if (kfifo_is_full(&quote_fifo)) {
        /* Буфер переполнен Пропускаем старые данные*/
        struct stock_quote dummy;
        (void)kfifo_out(&quote_fifo, &dummy, 1);
      }
      kfifo_in(&quote_fifo, &quote, 1);
      spin_unlock(&fifo_lock);

      /* БУДИМ ПОЛЬЗОВАТЕЛЯ */
      wake_up_interruptible(&quote_waitqueue);
    }
  }

  mod_timer(&quote_timer, jiffies + msecs_to_jiffies(timer_interval_ms));
}

/* =========================================================================
 * ФАЗА 2: ЧТЕНИЕ ДАННЫХ
 * ========================================================================= */
static ssize_t dev_read(struct file *filep, char __user *buffer, size_t len,
                        loff_t *offset) {
  struct stock_quote quote;
  char temp_buf[128];
  ssize_t bytes_to_send;
  int ret;

  /* 1. Если буфер пуст - засыпаем */
  if (wait_event_interruptible(quote_waitqueue, !kfifo_is_empty(&quote_fifo))) {
    return -ERESTARTSYS;
  }

  /* 2. Забираем структуру из буфера */
  spin_lock(&fifo_lock);
  ret = kfifo_out(&quote_fifo, &quote, 1);
  spin_unlock(&fifo_lock);

  if (ret == 0)
    return 0;

  /* 3. Вызываем Форматтер */
  bytes_to_send = current_fmt->format(&quote, temp_buf, sizeof(temp_buf));

  /* 4. Отправляем строку пользователю */
  if (bytes_to_send > len)
    bytes_to_send = len;

  if (copy_to_user(buffer, temp_buf, bytes_to_send)) {
    return -EFAULT;
  }

  return bytes_to_send;
}

static struct file_operations fops = {
    .owner = THIS_MODULE,
    .read = dev_read,
};

/* =========================================================================
 * ФАЗА 3: ИНИЦИАЛИЗАЦИЯ (Загрузка модуля: insmod)
 * ========================================================================= */
static int __init quote_sim_init(void) {
  /* 1. Регистрация устройства в системе */
  major_number = register_chrdev(0, DEVICE_NAME, &fops);

  quote_class = class_create(CLASS_NAME);

  quote_device = device_create(quote_class, NULL, MKDEV(major_number, 0), NULL,
                               DEVICE_NAME);

  /* 2. Инициализация буфера (kfifo) */
  INIT_KFIFO(quote_fifo);

  /* 3. Инициализация генератора */
  current_gen->init(&gen_private_data, "AAPL", 1500000);

  /* 4. Запуск таймера */
  timer_setup(&quote_timer, timer_callback, 0);
  mod_timer(&quote_timer, jiffies + msecs_to_jiffies(timer_interval_ms));

  pr_info("QuoteSim: Module loaded. Device /dev/%s created.\n", DEVICE_NAME);
  return 0;
}

/* =========================================================================
 * ФАЗА 4: ВЫХОД (Выгрузка модуля: rmmod)
 * ========================================================================= */
static void __exit quote_sim_exit(void) {
  timer_delete_sync(&quote_timer);

  if (current_gen->cleanup)
    current_gen->cleanup(gen_private_data);

  /* Удаление устройства из системы */
  device_destroy(quote_class, MKDEV(major_number, 0));
  class_destroy(quote_class);
  unregister_chrdev(major_number, DEVICE_NAME);

  pr_info("QuoteSim: Module unloaded.\n");
}

module_init(quote_sim_init);
module_exit(quote_sim_exit);