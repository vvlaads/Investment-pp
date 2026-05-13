import { apiAdapter } from "./apiAdapter";
import { request } from "./client";

async function getStocks(page = 1, limit = 20) {
    return request('/stocks/list', {
        method: 'GET',
        params: {
            page,
            limit,
        }
    })
}

async function mockGetStocks(page = 1, limit = 20) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        items: [
            { ticker: 'GAZP', name: 'Газпром', currentPrice: 70, changePercent: 16.67, type: 'stock' },
            { ticker: 'SBER', name: 'Сбербанк', currentPrice: 120, changePercent: -7.69, type: 'stock' },
            { ticker: 'AAPL', name: 'Apple', currentPrice: 248.7, changePercent: -0.52, type: 'stock' },
            { ticker: 'TSLA', name: 'Tesla', currentPrice: 118.6, changePercent: -1.17, type: 'stock' },
            { ticker: 'OFZ26238', name: 'ОФЗ 26238', currentPrice: 915, changePercent: 1.67, type: 'bond' }
        ],
        page,
        totalPages: 5,
    };
}

export const getStocksApi = apiAdapter(getStocks, mockGetStocks);

async function getStockInfo(ticker, beginDate, endDate) {
    return request('/stocks', {
        method: 'GET',
        params: {
            ticker,
            beginDate,
            endDate,
        },
    });
}

async function mockGetStockInfo(ticker, beginDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        ticker,
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

async function buyStock(data) {
    return request('/stocks/buy', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function mockBuyStock(data) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        status: 'success',
        message: 'Акция успешно куплена',
    };
}

export const buyStockApi = apiAdapter(buyStock, mockBuyStock);

async function sellStock(data) {
    return request('/stocks/sell', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function mockSellStock(data) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        status: 'success',
        message: 'Акция успешно продана',
    };
}

export const sellStockApi = apiAdapter(sellStock, mockSellStock);
