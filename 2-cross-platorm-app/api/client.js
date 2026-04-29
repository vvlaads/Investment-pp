import { config } from "./config";

export async function request(url, options = {}) {
    const res = await fetch(config.API_URL + url, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    if (!res.ok) {
        throw new Error('Ошибка запроса');
    }

    return res.json();
}