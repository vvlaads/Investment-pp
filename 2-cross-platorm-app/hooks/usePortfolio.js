import { useEffect, useState } from 'react';
import { getPortfolio, getAssets } from '../api/portfolioApi';

export function usePortfolio() {
    const [portfolio, setPortfolio] = useState(null);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const portfolioData = await getPortfolio();
                const assetsData = await getAssets();

                setPortfolio(portfolioData);
                setAssets(assetsData);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return { portfolio, assets, loading };
}