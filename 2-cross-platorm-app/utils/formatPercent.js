export function formatPercent(value, withPercent = false, withSign = false) {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }

    const formatted = Number(value).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    let result = formatted;
    if (withSign) {
        result = Number(value) > 0 ? `+${result}` : result;
    }
    if (withPercent) {
        result = `${result} %`;
    }
    return result;
}