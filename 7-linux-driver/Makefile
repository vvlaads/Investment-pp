obj-m += financial_quotes.o
financial_quotes-objs := financial_quotes_main.o quotes_generator.o char_device.o sysfs_interface.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

install:
	sudo insmod financial_quotes.ko
	sudo chmod 660 /dev/financial_quotes
	sudo chgrp financial /dev/financial_quotes

uninstall:
	sudo rmmod financial_quotes

test:
	cat /dev/financial_quotes
