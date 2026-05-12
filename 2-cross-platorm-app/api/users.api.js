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
        name: 'Test User',
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
        { ticker: 'GAZP', name: 'Газпром', quantity: 10 },
        { ticker: 'SBER', name: 'Сбербанк', quantity: 5 },
        // TODO: Добавить больше акций
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
