import { request } from './client';
import { mockAssets, mockPortfolio } from './mocks/portfolioMock';

const USE_MOCK = true;

export const getPortfolio = async () => {
    if (USE_MOCK) return mockPortfolio;

    return request('/portfolio');
};

export const getAssets = async () => {
    if (USE_MOCK) return mockAssets;

    return request('/assets');
};