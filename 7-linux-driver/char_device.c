#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/slab.h>
#include <linux/device.h>
#include <linux/cdev.h>
#include <linux/string.h>
#include "char_device.h"
#include "quotes_generator.h"
#include "quotes_data.h"

#define DEVICE_NAME "financial_quotes"
#define BUFFER_SIZE 4096
#define SCALE_VAL 1000000LL

static dev_t dev_num;
static struct cdev financial_cdev;
static struct class *financial_class;

static void format_fixed(char *buf, long long value) {
    char s[32];
    long long abs_val = (value < 0) ? -value : value;
    long long integer_part = abs_val / SCALE_VAL;
    long long fractional_part = abs_val % SCALE_VAL;

    snprintf(buf, 32, "%s%lld.%06lld", (value < 0 ? "-" : ""), integer_part, fractional_part);
}

static ssize_t dev_read(struct file *file, char __user *buf, size_t count, loff_t *ppos) {
    char *kbuf;
    int len = 0;
    int i;

    if (*ppos > 0) return 0;

    kbuf = kzalloc(BUFFER_SIZE, GFP_KERNEL);
    if (!kbuf) return -ENOMEM;

    if (g_output_format == FORMAT_JSON) {
        len += snprintf(kbuf + len, BUFFER_SIZE - len, "[");
        for (i = 0; i < g_num_instruments; i++) {
            if (!g_instruments[i].active) continue;

            struct financial_quote quote;
            char b_str[32], a_str[32], s_str[32], c_str[32];
            quotes_generator_generate_quote(&g_instruments[i], &quote);

            format_fixed(b_str, quote.bid);
            format_fixed(a_str, quote.ask);
            format_fixed(s_str, quote.spread);
            format_fixed(c_str, quote.change_percent);

            len += snprintf(kbuf + len, BUFFER_SIZE - len,
                "{\"symbol\":\"%s\",\"bid\":%s,\"ask\":%s,\"spread\":%s,\"timestamp\":%llu,\"volume\":%lu,\"change_percent\":%s}%s",
                quote.symbol, b_str, a_str, s_str, (unsigned long long)ktime_to_ns(quote.timestamp),
                quote.volume, c_str, (i < g_num_instruments - 1) ? "," : "");
        }
        len += snprintf(kbuf + len, BUFFER_SIZE - len, "]");
    } else {
        len += snprintf(kbuf + len, BUFFER_SIZE - len, "symbol,bid,ask,spread,timestamp,volume,change_percent\n");
        for (i = 0; i < g_num_instruments; i++) {
            if (!g_instruments[i].active) continue;

            struct financial_quote quote;
            char b_str[32], a_str[32], s_str[32], c_str[32];
            quotes_generator_generate_quote(&g_instruments[i], &quote);

            format_fixed(b_str, quote.bid);
            format_fixed(a_str, quote.ask);
            format_fixed(s_str, quote.spread);
            format_fixed(c_str, quote.change_percent);

            len += snprintf(kbuf + len, BUFFER_SIZE - len,
                "%s,%s,%s,%s,%llu,%lu,%s\n",
                quote.symbol, b_str, a_str, s_str, (unsigned long long)ktime_to_ns(quote.timestamp),
                quote.volume, c_str);
        }
    }

    if (copy_to_user(buf, kbuf, len)) {
        kfree(kbuf);
        return -EFAULT;
    }

    *ppos += len;
    kfree(kbuf);
    return len;
}

static struct file_operations fops = {
    .owner = THIS_MODULE,
    .read = dev_read,
};

int char_device_init(void) {
    int ret;

    ret = alloc_chrdev_region(&dev_num, 0, 1, DEVICE_NAME);
    if (ret < 0) return ret;

    cdev_init(&financial_cdev, &fops);
    ret = cdev_add(&financial_cdev, dev_num, 1);
    if (ret < 0) {
        unregister_chrdev_region(dev_num, 1);
        return ret;
    }

    financial_class = class_create(DEVICE_NAME);
    if (IS_ERR(financial_class)) {
        cdev_del(&financial_cdev);
        unregister_chrdev_region(dev_num, 1);
        return PTR_ERR(financial_class);
    }

    if (IS_ERR(device_create(financial_class, NULL, dev_num, NULL, DEVICE_NAME))) {
        class_destroy(financial_class);
        cdev_del(&financial_cdev);
        unregister_chrdev_region(dev_num, 1);
        return -1;
    }

    return 0;
}

void char_device_exit(void) {
    device_destroy(financial_class, dev_num);
    class_destroy(financial_class);
    cdev_del(&financial_cdev);
    unregister_chrdev_region(dev_num, 1);
}
