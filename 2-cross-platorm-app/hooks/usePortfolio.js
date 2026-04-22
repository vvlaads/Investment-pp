import { useEffect, useState } from 'react';
import { getAssets } from '../api/assets.api';
import { getCompanies } from '../api/companies.api';

export function usePortfolio() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [assetsData, companies] =
                    await Promise.all([
                        getAssets(),
                        getCompanies()
                    ]);

                const companyMap = Object.fromEntries(
                    companies.map(c => [c.id, c])
                );

                const enrichedAssets = assetsData.map(asset => ({
                    ...asset,
                    company: companyMap[asset.companyId]
                }));
                setAssets(enrichedAssets);

            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return { assets, loading };
}