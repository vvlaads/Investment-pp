#!/bin/bash
# Проверка загрузки модуля
echo "Checking if module is loaded..."
lsmod | grep financial_quotes

# Чтение котировок (должно быть пусто или ошибка, так как генерация по умолчанию выключена)
echo "Reading quotes (expected: empty or error if disabled)..."
cat /dev/financial_quotes

# Включение генерации
echo "Enabling generation..."
echo "1" | sudo tee /sys/kernel/financial/control

# Чтение котировок
echo "Reading quotes (now enabled)..."
cat /dev/financial_quotes

# Изменение активных инструментов
echo "Changing active symbols to EUR/USD,BTC/USD..."
echo "EUR/USD,BTC/USD" | sudo tee /sys/kernel/financial/active_symbols

# Чтение в цикле
echo "Reading quotes in a loop (5 times)..."
for i in {1..5}; do
    cat /dev/financial_quotes
    sleep 0.5
done

# Выключение генерации
echo "Disabling generation..."
echo "0" | sudo tee /sys/kernel/financial/control
