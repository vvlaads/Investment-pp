import { apiAdapter } from "./apiAdapter";
import { request } from "./client";

async function getUserInfo() {
    return request('/users', {
        method: 'GET',
    });
}

async function mockGetUserInfo() {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        id: 1,
        email: 'test@test.com',
        surname: 'Иванов',
        firstName: 'Андрей',
        patronymic: 'Сергеевич'
    };
}

export const getUserInfoApi = apiAdapter(getUserInfo, mockGetUserInfo);

async function getUserStocks() {
    return request('/users/stocks', {
        method: 'GET',
    });
}

async function mockGetUserStocks() {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return [
        { ticker: 'GAZP', name: 'Газпром', quantity: 10, avgPurchasePrice: 60, currentPrice: 70, type: 'stock' },
        { ticker: 'SBER', name: 'Сбербанк', quantity: 5, avgPurchasePrice: 130, currentPrice: 120, type: 'stock' },
        { ticker: 'AAPL', name: 'Apple', quantity: 3, avgPurchasePrice: 250, currentPrice: 248.7, type: 'stock' },
        { ticker: 'TSLA', name: 'Tesla', quantity: 6, avgPurchasePrice: 120, currentPrice: 118.6, type: 'stock' },
        { ticker: 'OFZ26238', name: 'ОФЗ 26238', quantity: 1, avgPurchasePrice: 900, currentPrice: 915, type: 'bond' }
    ];
}

export const getUserStocksApi = apiAdapter(getUserStocks, mockGetUserStocks);

async function deleteUser() {
    return request('/users', {
        method: 'DELETE',
    });
}

async function mockDeleteUser() {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        status: 'success',
        message: 'Пользователь успешно удален',
    };
}

export const deleteUserApi = apiAdapter(deleteUser, mockDeleteUser);

async function updateUser(data) {
    return request('/users', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function mockUpdateUser(data) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        status: 'success',
        message: 'Данные пользователя успешно обновлены',
    };
}

export const updateUserApi = apiAdapter(updateUser, mockUpdateUser);
