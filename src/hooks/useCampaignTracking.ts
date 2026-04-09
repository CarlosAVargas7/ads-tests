import { useEffect, useState } from 'react';
import { UTMData } from '../types';

export const useCampaignTracking = (): UTMData => {
    const [utmData, setUtmData] = useState<UTMData>({});

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams: UTMData = {
            utm_source: urlParams.get('utm_source') || undefined,
            utm_medium: urlParams.get('utm_medium') || undefined,
            utm_campaign: urlParams.get('utm_campaign') || undefined,
            utm_term: urlParams.get('utm_term') || undefined,
            utm_content: urlParams.get('utm_content') || undefined
        };

        if (Object.values(utmParams).some(param => param !== undefined)) {
            setUtmData(utmParams);
            
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'campaign_landing',
                campaign_source: utmParams.utm_source,
                campaign_medium: utmParams.utm_medium,
                campaign_name: utmParams.utm_campaign,
                campaign_term: utmParams.utm_term,
                campaign_content: utmParams.utm_content,
                landing_page: window.location.pathname,
                timestamp: new Date().toISOString(),
                engagement_time_msec: 0
            });
            
            console.log('?? Campaign detected:', utmParams);
            localStorage.setItem('utm_data', JSON.stringify(utmParams));
        } else {
            const savedUtm = localStorage.getItem('utm_data');
            if (savedUtm) {
                setUtmData(JSON.parse(savedUtm));
            }
        }
    }, []);

    return utmData;
};
