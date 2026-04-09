import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useUTMTracking } from '../hooks/useUTMTracking';
import { useAudienceTracking } from '../hooks/useAudienceTracking';
import { useUserAcquisitionTracking } from '../hooks/useUserAcquisitionTracking';

export const CheckoutSuccess: React.FC = () => {
    const orderId = 'ORD-' + Date.now();
    const { getStoredUTMData } = useUTMTracking();
    const { trackPurchase } = useAudienceTracking({ items: [], total: 0, isOpen: false });
    const { injectUserData } = useUserAcquisitionTracking();

    // Track purchase event on page load
    useEffect(() => {
        // Get cart data from localStorage (stored during checkout)
        const cartData = localStorage.getItem('checkout_cart');
        if (cartData) {
            const cart = JSON.parse(cartData);

            window.dataLayer = window.dataLayer || [];

            // Get UTM data for conversion attribution
            const utmData = getStoredUTMData();

            // Purchase event - CRITICAL for Google Ads conversion tracking
            const purchaseEvent = {
                event: 'purchase',
                ecommerce: {
                    transaction_id: orderId,
                    value: cart.total || 0,
                    currency: 'USD',
                    items: cart.items?.map((item: any) => ({
                        item_name: item.name,
                        item_id: item.id,
                        price: item.price,
                        item_category: item.category,
                        item_variant: item.itemType,
                        quantity: item.quantity
                    })) || []
                }
            };

            // Add UTM data if available for conversion attribution
            if (utmData) {
                Object.assign(purchaseEvent, {
                    utm_source: utmData.utm_source,
                    utm_campaign: utmData.utm_campaign,
                    utm_medium: utmData.utm_medium,
                    utm_term: utmData.utm_term,
                    utm_content: utmData.utm_content,
                    utm_timestamp: utmData.timestamp
                });
            }

            // Inject user data
            const purchaseEventWithUser = injectUserData(purchaseEvent);
            window.dataLayer.push(purchaseEventWithUser);

            // Track purchase with audience data
            trackPurchase(cart.total || 0);

            console.log('?? Purchase Event:', {
                transaction_id: orderId,
                value: cart.total,
                items_count: cart.items?.length || 0
            });

            // Clear cart data after tracking
            localStorage.removeItem('checkout_cart');
        }
    }, [orderId]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <SEO title="Compra Completada | Gracias por tu Pedido" desc="Confirmación de tu compra exitosa" />

            <div className="max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-white mb-4">
                    ¡Gracias por tu compra!
                </h1>

                <p className="text-gray-400 mb-8">
                    Tu pedido ha sido procesado exitosamente. Hemos enviado un email de confirmación con todos los detalles.
                </p>

                {/* Order Details */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
                    <h2 className="text-lg font-semibold text-white mb-4">Detalles del Pedido</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Número de Pedido:</span>
                            <span className="text-white font-mono">{orderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Fecha:</span>
                            <span className="text-white">{new Date().toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Estado:</span>
                            <span className="text-green-400 font-medium">Confirmado</span>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">¿Qué sigue?</h3>
                    <div className="space-y-3 text-sm text-gray-300">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">1</span>
                            </div>
                            <div>
                                <div className="text-white font-medium">Email de Confirmación</div>
                                <div>Recibirás un email con los detalles de tu pedido y información de seguimiento.</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">2</span>
                            </div>
                            <div>
                                <div className="text-white font-medium">Procesamiento del Pedido</div>
                                <div>Tu pedido será procesado dentro de las próximas 24 horas.</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">3</span>
                            </div>
                            <div>
                                <div className="text-white font-medium">Envío</div>
                                <div>Recibirás tu pedido en 3-5 días hábiles según tu ubicación.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        to="/tienda"
                        className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Seguir Comprando
                    </Link>
                    <Link
                        to="/"
                        className="block w-full bg-gray-700 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                        Volver al Inicio
                    </Link>
                </div>

                {/* Support */}
                <div className="mt-8 text-sm text-gray-400">
                    <p>¿Necesitas ayuda?</p>
                    <p>Contacta a nuestro equipo de soporte:</p>
                    <p className="text-indigo-400">soporte@ejemplo.com</p>
                </div>
            </div>
        </div>
    );
};
