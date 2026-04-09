import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnalytics = (): void => {
    const location = useLocation();

    useEffect(() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'page_view',
            page_path: location.pathname,
            page_title: document.title,
            engagement_time_msec: 50
        });
        console.log(`? Page View SPA: ${location.pathname}`);
    }, [location]);
};
