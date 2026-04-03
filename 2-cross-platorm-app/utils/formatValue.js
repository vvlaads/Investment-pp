export function formatValue(value, withCurrency = false) {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }

    const formatted = Number(value).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return withCurrency ? `${formatted} ₽` : formatted;
}