import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkout } from '../components/Checkout';
import { useCheckout } from '../hooks/useCheckout';
import { useCartContext } from '../contexts/CartContext';
import { SEO } from '../components/SEO';

export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart } = useCartContext();
    const checkout = useCheckout(cart);

    // Track begin_checkout event when user enters checkout
    useEffect(() => {
        if (cart.items.length > 0) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'begin_checkout',
                ecommerce: {
                    currency: 'USD',
                    value: cart.total,
                    items: cart.items.map(item => ({
                        item_name: item.name,
                        item_id: item.id,
                        price: item.price,
                        item_category: item.category,
                        item_variant: item.itemType,
                        quantity: item.quantity
                    }))
                }
            });

            console.log('?? Begin Checkout Event:', {
                value: cart.total,
                items_count: cart.items.length
            });
        }
    }, [cart.items.length, cart.total]);

    const handleCompleteCheckout = async () => {
        // Save cart data to localStorage for purchase event tracking
        localStorage.setItem('checkout_cart', JSON.stringify(cart));

        await checkout.completeCheckout();
        navigate('/checkout-success');
    };

    // Redirect to cart if cart is empty (but not after successful checkout)
    React.useEffect(() => {
        if (cart.items.length === 0 && checkout.checkoutState.currentStep !== 'success') {
            navigate('/tienda');
        }
    }, [cart.items.length, navigate, checkout.checkoutState.currentStep]);

    if (cart.items.length === 0 && checkout.checkoutState.currentStep !== 'success') {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <SEO title="Checkout | Carrito Vacío" desc="Tu carrito está vacío" />
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Carrito Vacío</h1>
                    <p className="text-gray-400 mb-8">Tu carrito está vacío. Añade productos para continuar.</p>
                    <button
                        onClick={() => navigate('/tienda')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Ir a la Tienda
                    </button>
                </div>
            </div>
        );
    }

    if (checkout.checkoutState.currentStep === 'success') {
        return <div>Redirecting to success page...</div>;
    }

    return (
        <>
            <SEO title="Checkout | Proceso de Compra" desc="Completa tu compra de forma segura" />
            <Checkout
                checkoutState={checkout.checkoutState}
                onShippingInfoUpdate={checkout.updateShippingInfo}
                onPaymentInfoUpdate={checkout.updatePaymentInfo}
                onNextStep={checkout.goToNextStep}
                onPreviousStep={checkout.goToPreviousStep}
                onStepClick={checkout.goToStep}
                onCompleteCheckout={handleCompleteCheckout}
            />
        </>
    );
};
