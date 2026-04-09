import { useEffect, useState } from 'react';

export const CookieConsent: React.FC = () => {
    const [showBanner, setShowBanner] = useState(true);

    const acceptCookies = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) { window.dataLayer.push(args); }

        gtag('consent', 'update', {
            'ad_storage': 'granted',
            'analytics_storage': 'granted',
            'personalization_storage': 'granted',
            'functionality_storage': 'granted'
        });

        localStorage.setItem('cookie_consent', 'granted');

        window.dataLayer.push({
            event: 'cookie_consent_accepted',
            consent_type: 'all',
            engagement_time_msec: 300
        });

        console.log('?? Consent Mode: Actualizado a Granted');
        setShowBanner(false);
    };

    const rejectCookies = () => {
        localStorage.setItem('cookie_consent', 'rejected');

        window.dataLayer.push({
            event: 'cookie_consent_rejected',
            consent_type: 'essential_only',
            engagement_time_msec: 100
        });

        console.log('?? Consent Mode: Permanece en Denied (solo esenciales)');
        setShowBanner(false);
    };

    useEffect(() => {
        const savedConsent = localStorage.getItem('cookie_consent');
        if (savedConsent === 'granted') {
            // If user already granted consent, update gtag immediately
            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) { window.dataLayer.push(args); }

            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted',
                'personalization_storage': 'granted',
                'functionality_storage': 'granted'
            });

            console.log('?? Consent Mode: Restaurado a Granted (localStorage)');
            setShowBanner(false);
        } else if (savedConsent === 'rejected') {
            setShowBanner(false);
        }
    }, []);

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-50">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-gray-300 text-sm">
                    <p className="font-semibold mb-1">?? Usamos cookies para mejorar tu experiencia</p>
                    <p>Las cookies nos ayudan a analizar el tráfico y personalizar el contenido. Al aceptar, nos ayudas a mejorar nuestros servicios.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={rejectCookies}
                        className="px-4 py-2 text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                        Rechazar
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                        Aceptar todas
                    </button>
                </div>
            </div>
        </div>
    );
};
