import { apiAdapter } from "./apiAdapter";
import { request } from "./client";

async function login(email, password) {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

async function mockLogin(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // фейковая ошибка
    if (email == 'test@test.com' && password !== '123456') {
        throw new Error('Неверный email или пароль');
    }

    return {
        token: 'fake-jwt-token',
        user: {
            id: 1,
            email,
            name: 'Test User',
        },
    };
}

export const loginUser = apiAdapter(login, mockLogin);

async function register(data) {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function mockRegister(data) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        token: 'fake-token',
        user: data,
    };
}

export const registerUser = apiAdapter(register, mockRegister);