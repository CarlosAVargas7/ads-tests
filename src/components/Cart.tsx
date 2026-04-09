import { CartState } from '../types/cart';
import { useNavigate } from 'react-router-dom';
import { useUTMTracking } from '../hooks/useUTMTracking';
import { useEffect } from 'react';

interface CartProps {
    cart: CartState;
    onRemove: (itemId: string, itemType: 'service' | 'product') => void;
    onUpdateQuantity: (itemId: string, itemType: 'service' | 'product', quantity: number) => void;
    onClear: () => void;
    onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ cart, onRemove, onUpdateQuantity, onClear, onClose }) => {
    const navigate = useNavigate();
    const { injectUTMData } = useUTMTracking();

    // Track view_cart event when cart opens
    useEffect(() => {
        if (cart.isOpen && cart.items.length > 0) {
            window.dataLayer = window.dataLayer || [];
            const viewCartEvent = {
                event: 'view_cart',
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
            };

            // Inject UTM data
            const viewCartEventWithUTM = injectUTMData(viewCartEvent);
            window.dataLayer.push(viewCartEventWithUTM);

            console.log('?? View Cart Event:', {
                value: cart.total,
                items_count: cart.items.length
            });
        }
    }, [cart.isOpen, cart.items, cart.total]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const handleCheckout = () => {
        if (cart.items.length === 0) return;

        // Track begin_checkout event
        window.dataLayer = window.dataLayer || [];
        const beginCheckoutEvent = {
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
        };

        // Inject UTM data
        const beginCheckoutEventWithUTM = injectUTMData(beginCheckoutEvent);
        window.dataLayer.push(beginCheckoutEventWithUTM);

        console.log('?? Checkout started with', cart.items.length, 'items');
        onClose();
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-800 shadow-xl">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <h2 className="text-lg font-semibold text-white">Carrito ({cart.items.length})</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {cart.items.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-4xl mb-4">??</div>
                                <p className="text-gray-400">Tu carrito está vacío</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={`${item.id}-${item.itemType}`} className="bg-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h3 className="text-white font-medium">{item.name}</h3>
                                                <p className="text-gray-400 text-sm">{item.category}</p>
                                                <p className="text-indigo-400 font-semibold">{formatPrice(item.price)}</p>
                                            </div>
                                            <button
                                                onClick={() => onRemove(item.id, item.itemType)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.itemType, item.quantity - 1)}
                                                className="w-8 h-8 rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="text-white w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.itemType, item.quantity + 1)}
                                                className="w-8 h-8 rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.items.length > 0 && (
                        <div className="border-t border-gray-700 p-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Subtotal:</span>
                                <span className="text-xl font-bold text-white">{formatPrice(cart.total)}</span>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Proceder al Checkout
                                </button>
                                <button
                                    onClick={onClear}
                                    className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                >
                                    Vaciar Carrito
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
