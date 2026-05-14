#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/timer.h>
#include "quotes_data.h"
#include "quotes_generator.h"
#include "char_device.h"
#include "sysfs_interface.h"

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Claude Code");
MODULE_DESCRIPTION("Linux Driver for Simulated Financial Quotes");

static int fmt_param = 0; // 0: JSON, 1: CSV
module_param(fmt_param, int, 0444);
MODULE_PARM_DESC(fmt_param, "Output format: 0 for JSON, 1 for CSV");

/* Global state defined here */
output_format_t g_output_format;
unsigned int g_update_interval_ms = 100;
bool g_generation_enabled = false;
struct financial_instrument g_instruments[MAX_SYMBOLS];
int g_num_instruments = 0;

static struct timer_list update_timer;

static void timer_callback(struct timer_list *t) {
    quotes_generator_update();
    mod_timer(&update_timer, jiffies + msecs_to_jiffies(g_update_interval_ms));
}

static int __init financial_quotes_init(void) {
    pr_info("Financial Quotes Driver: Initializing\n");

    g_output_format = (fmt_param == 1) ? FORMAT_CSV : FORMAT_JSON;

    quotes_generator_init();

    if (char_device_init() < 0) {
        pr_err("Financial Quotes Driver: Failed to init char device\n");
        return -1;
    }

    if (sysfs_interface_init() < 0) {
        pr_err("Financial Quotes Driver: Failed to init sysfs interface\n");
        char_device_exit();
        return -1;
    }

    timer_setup(&update_timer, timer_callback, 0);
    mod_timer(&update_timer, jiffies + msecs_to_jiffies(g_update_interval_ms));

    pr_info("Financial Quotes Driver: Loaded successfully\n");
    return 0;
}

static void __exit financial_quotes_exit(void) {
    pr_info("Financial Quotes Driver: Exiting\n");

    del_timer_sync(&update_timer);
    sysfs_interface_exit();
    char_device_exit();

    pr_info("Financial Quotes Driver: Unloaded\n");
}

module_init(financial_quotes_init);
module_exit(financial_quotes_exit);
