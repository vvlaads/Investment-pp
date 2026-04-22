import { apiAdapter } from './index';
import { companies as mockCompanies } from '../mocks/companies';
import { request } from './client';

async function fetchCompanies() {
    return request('/companies');
}

async function mockFetchCompanies() {
    return mockCompanies;
}

export const getCompanies = apiAdapter(fetchCompanies, mockFetchCompanies);