# Имя итогового модуля (будет quote_sim.ko)
obj-m += quote_sim.o

# Если модуль состоит из нескольких файлов (а так и будет), перечисляем их:
quote_sim-objs := main.o

# Путь к исходникам текущего ядра
KDIR := /lib/modules/$(shell uname -r)/build
PWD := $(shell pwd)

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean