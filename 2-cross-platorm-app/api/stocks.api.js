import { apiAdapter } from "./apiAdapter";
import { request } from "./client";

async function getStockInfo(name, beginDate, endDate) {
    return request('/stocks', {
        method: 'GET',
        params: {
            name,
            beginDate,
            endDate,
        },
    });
}

async function mockGetStockInfo(name, beginDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        name,
        beginDate,
        endDate,
        data: [
            { date: '2023-01-01', price: 100 },
            { date: '2023-01-02', price: 105 },
            // TODO: Добавить больше данных
        ],
    };
}

export const getStockInfoApi = apiAdapter(getStockInfo, mockGetStockInfo);

async function buySellStock(data) {
    return request('/stocks', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function mockBuySellStock(data) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        status: 'success',
        message: 'Акция успешно куплена/продана',
    };
}

export const buySellStockApi = apiAdapter(buySellStock, mockBuySellStock);
