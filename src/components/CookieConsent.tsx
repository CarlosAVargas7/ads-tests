import { useEffect, useState } from 'react';

export const CookieConsent: React.FC = () => {
    const [showBanner, setShowBanner] = useState(true);

    const updateConsent = (granted: boolean) => {
        const consentStatus = granted ? 'granted' : 'denied';

        window.dataLayer = window.dataLayer || [];

        // Consent Mode v2 - Forma recomendada con GTM
        window.dataLayer.push({
            event: 'consent_update',
            ad_storage: consentStatus,
            analytics_storage: consentStatus,
            ad_user_data: consentStatus,
            ad_personalization: consentStatus,
            functionality_storage: granted ? 'granted' : 'denied',
            personalization_storage: consentStatus,
            security_storage: 'granted'   // Siempre granted (esenciales)
        });

        // Evento adicional para triggers en GTM
        window.dataLayer.push({
            event: granted ? 'cookie_consent_accepted' : 'cookie_consent_rejected',
            consent_type: granted ? 'all' : 'essential_only',
            consent_action: granted ? 'accept_all' : 'reject'
        });

        localStorage.setItem('cookie_consent', granted ? 'granted' : 'rejected');

        console.log(`✅ Consent Mode: Actualizado a ${granted ? 'GRANTED' : 'DENIED'}`);
        setShowBanner(false);
    };

    const acceptCookies = () => updateConsent(true);
    const rejectCookies = () => updateConsent(false);

    // Restaurar consentimiento guardado
    useEffect(() => {
        const savedConsent = localStorage.getItem('cookie_consent');

        if (savedConsent === 'granted') {
            updateConsent(true);
        } else if (savedConsent === 'rejected') {
            updateConsent(false);
        }
        // Si no hay nada guardado → mostramos el banner (default = denied)
    }, []);

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-50 shadow-lg">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-gray-300 text-sm">
                    <p className="font-semibold mb-1">🍪 Usamos cookies para mejorar tu experiencia</p>
                    <p>Las cookies nos ayudan a analizar el tráfico, medir el rendimiento de los anuncios y personalizar el contenido.</p>
                </div>

                <div className="flex gap-3 flex-shrink-0">
                    <button
                        onClick={rejectCookies}
                        className="px-5 py-2 text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                        Rechazar
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        Aceptar todas
                    </button>
                </div>
            </div>
        </div>
    );
};