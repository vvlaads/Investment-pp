const BASE_URL = 'https://your-api.com';

export async function request(url, options = {}) {
    const res = await fetch(BASE_URL + url, {
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