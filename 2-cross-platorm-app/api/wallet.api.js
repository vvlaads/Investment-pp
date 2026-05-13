import { apiAdapter } from "./apiAdapter";
import { request } from "./client";

async function getBalance() {
    return request('/wallet/balance', {
        method: 'GET',
    });
}

async function mockGetBalance() {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return 15_000;
}

async function deposit(amount) {
    return request('/wallet/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount }),
    });
}

async function mockDeposit(amount) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        success: true,
        message: 'Успешно пополнен счет'
    }
}

async function withdraw(amount) {
    return request('/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount }),
    });
}

async function mockWithdraw(amount) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        success: true,
        message: 'Успешно списано со счета'
    }
}

export const getBalanceApi = apiAdapter(getBalance, mockGetBalance);
export const depositApi = apiAdapter(deposit, mockDeposit);
export const withdrawApi = apiAdapter(withdraw, mockWithdraw);