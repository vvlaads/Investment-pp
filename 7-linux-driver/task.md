# Задача: Создать драйвер Linux для имитации финансовых котировок

Мне нужен драйвер ядра Linux, который генерирует случайные финансовые котировки и предоставляет доступ к ним через `/dev/financial_quotes`. К этому драйверу будет обращаться микросервис на Go.

## 1. Функциональные требования

### Имитируемые инструменты и начальные цены

- EUR/USD: 1.0850
- BTC/USD: 43250.00
- AAPL: 178.50
- GOLD: 2034.80
- SBER: 285.50

### Структура котировки (один JSON-объект или строка CSV)

- `symbol` — тикер инструмента
- `bid` — цена покупки
- `ask` — цена продажи
- `spread` — спред (ask - bid)
- `timestamp` — время генерации в наносекундах
- `volume` — объём торгов
- `change_percent` — изменение в процентах

### Логика генерации

- Random walk (случайное блуждание) с волатильностью 0.1–2%
- Обновление данных каждые 100 мс (настраивается)

### Управление через sysfs (`/sys/kernel/financial/`)

- `control` — запись `1` или `0` для запуска/остановки генерации
- `active_symbols` — запись списка инструментов через запятую, например `EUR/USD,BTC/USD`
- `update_interval_ms` — запись интервала обновления в миллисекундах

### Формат вывода (настраивается через параметр при загрузке модуля)

- JSON (по умолчанию)
- CSV

## 2. Техническая архитектура

### Тип драйвера

Символьное устройство (character device).

### Основной интерфейс

Устройство `/dev/financial_quotes`. При чтении возвращает текущие котировки для всех активных инструментов.

### Файлы проекта

financial_quotes_main.c — инициализация и очистка модуля
quotes_generator.c/.h — генератор случайных котировок
char_device.c/.h — реализация файловых операций (read/write)
sysfs_interface.c/.h — интерфейс sysfs для управления
quotes_data.h — структуры данных

### Безопасность

- Права на устройство: `0660`
- Группа: `financial`
- Проверка входных данных в sysfs
- Защита от переполнения буфера

## 3. Файлы для сборки и тестирования

### Makefile

```makefile
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
```

### Тестирование

```bash
#!/bin/bash
# Проверка загрузки модуля
lsmod | grep financial_quotes

# Чтение котировок
cat /dev/financial_quotes

# Изменение активных инструментов
echo "EUR/USD,BTC/USD" | sudo tee /sys/kernel/financial/active_symbols

# Чтение в цикле
for i in {1..5}; do
    cat /dev/financial_quotes
    sleep 0.5
done
```
