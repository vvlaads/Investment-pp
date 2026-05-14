#ifndef CHAR_DEVICE_H
#define CHAR_DEVICE_H

#include <linux/fs.h>

int char_device_init(void);
void char_device_exit(void);

#endif /* CHAR_DEVICE_H */
