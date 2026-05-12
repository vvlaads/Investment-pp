import { config } from "../utils/config"

export function apiAdapter(realFn, mockFn) {
    return async (...args) => {
        if (config.USE_MOCK) return mockFn(...args);
        return realFn(...args);
    };
}