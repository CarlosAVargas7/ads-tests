import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const CheckoutSuccess: React.FC = () => {
    const orderId = 'ORD-' + Date.now().toString().slice(-8);

    useEffect(() => {
        const cartData = localStorage.getItem('checkout_cart');
        if (!cartData) return;

        try {
            const cart = JSON.parse(cartData);

            if (!cart.total || !cart.items || cart.items.length === 0) return;

            window.dataLayer = window.dataLayer || [];

            const purchaseEvent = {
                event: 'purchase',
                ecommerce: {
                    transaction_id: orderId,
                    value: Number(cart.total) || 0,
                    currency: 'USD',                    // Cambia a 'COP' si usas pesos colombianos
                    tax: Number(cart.tax) || 0,
                    shipping: Number(cart.shipping) || 0,
                    items: cart.items.map((item: any) => ({
                        item_id: item.id?.toString() || '',
                        item_name: item.name || '',
                        item_category: item.category || '',
                        item_variant: item.itemType || item.variant || '',
                        price: Number(item.price) || 0,
                        quantity: Number(item.quantity) || 1,
                        currency: 'USD'
                    }))
                },
                // Datos adicionales útiles para Ads y atribución
                value: Number(cart.total) || 0,
                currency: 'USD',
                transaction_id: orderId,
                items_count: cart.items.length
            };

            // Push al dataLayer (forma correcta con GTM)
            window.dataLayer.push(purchaseEvent);

            console.log('✅ Evento purchase enviado correctamente:', {
                transaction_id: orderId,
                value: cart.total,
                items: cart.items.length,
                currency: 'USD'
            });

            // Limpiar datos
            localStorage.removeItem('checkout_cart');

        } catch (error) {
            console.error('Error al enviar evento purchase:', error);
        }
    }, [orderId]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Icono de éxito */}
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">
                    ¡Gracias por tu compra!
                </h1>

                <p className="text-gray-400 mb-8">
                    Tu pedido ha sido procesado exitosamente.
                </p>

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
            </div>
        </div>
    );
};