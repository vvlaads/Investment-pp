import { apiAdapter } from './apiAdapter';
import { assets as mockAssets } from '../mocks/assets';
import { request } from './client';

async function fetchAssets() {
    return request('/assets');
}

async function mockFetchAssets() {
    return mockAssets;
}

export const getAssets = apiAdapter(fetchAssets, mockFetchAssets);