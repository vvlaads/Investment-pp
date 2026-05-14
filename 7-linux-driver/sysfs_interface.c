#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/string.h>
#include "sysfs_interface.h"
#include "quotes_data.h"

static struct kobject *financial_kobj;

static ssize_t control_store(struct kobject *kobj, struct kobj_attribute *attr, const char *user, size_t count) {
    if (count == 1) {
        if (user[0] == '1') g_generation_enabled = true;
        else if (user[0] == '0') g_generation_enabled = false;
    }
    return count;
}

static ssize_t control_show(struct kobject *kobj, struct kobj_attribute *attr, char *buf) {
    return sprintf(buf, "%d\n", g_generation_enabled);
}

static struct kobj_attribute control_attr = __ATTR_S(control, 0660, control_show, control_store);

static ssize_t active_symbols_store(struct kobject *kobj, struct kobj_attribute *attr, const char *user, size_t count) {
    char buf[256];
    char *token;
    int i;

    if (count >= sizeof(buf)) return -EINVAL;
    memcpy(buf, user, count);
    buf[count] = '\0';

    // Deactivate all first
    for (i = 0; i < g_num_instruments; i++) g_instruments[i].active = false;

    token = strsep(&buf, ",");
    while (token) {
        for (i = 0; i < g_num_instruments; i++) {
            if (strcmp(token, g_instruments[i].symbol) == 0) {
                g_instruments[i].active = true;
                break;
            }
        }
        token = strsep(&buf, ",");
    }
    return count;
}

static ssize_t active_symbols_show(struct kobject *kobj, struct kobj_attribute *attr, char *buf) {
    int len = 0;
    int i;
    for (i = 0; i < g_num_instruments; i++) {
        if (g_instruments[i].active) {
            len += sprintf(buf + len, "%s%s", (len == 0 ? "" : ","), g_instruments[i].symbol);
        }
    }
    return sprintf(buf + len, "\n");
}

static struct kobj_attribute active_symbols_attr = __ATTR_S(active_symbols, 0660, active_symbols_show, active_symbols_store);

static ssize_t update_interval_store(struct kobject *kobj, struct kobj_attribute *attr, const char *user, size_t count) {
    int val;
    if (kstrtoint(user, 10, &val) < 0) return -EINVAL;
    g_update_interval_ms = val;
    return count;
}

static ssize_t update_interval_show(struct kobject *kobj, struct kobj_attribute *attr, char *buf) {
    return sprintf(buf, "%d\n", g_update_interval_ms);
}

static struct kobj_attribute update_interval_attr = __ATTR_S(update_interval_ms, 0660, update_interval_show, update_interval_store);

static struct kobj_attribute *attrs[] = {
    &control_attr,
    &active_symbols_attr,
    &update_interval_attr,
    NULL
};

int sysfs_interface_init(void) {
    financial_kobj = sysfs_create_kobject(KERNEL_NAME, "financial");
    if (!financial_kobj) return -ENOMEM;

    int i;
    for (i = 0; attrs[i] != NULL; i++) {
        if (sysfs_create_file(financial_kobj, attrs[i]->attr.name, attrs[i], NULL) < 0) {
            // Log error
        }
    }
    return 0;
}

void sysfs_interface_exit(void) {
    int i;
    for (i = 0; attrs[i] != NULL; i++) {
        sysfs_remove_file(financial_kobj, attrs[i]->attr.name);
    }
    kobject_put(financial_kobj);
}
