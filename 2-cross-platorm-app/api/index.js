const USE_MOCK = true;

export function apiAdapter(realFn, mockFn) {
    return async (...args) => {
        if (USE_MOCK) return mockFn(...args);
        return realFn(...args);
    };
}