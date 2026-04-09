import { CartState } from '../types/cart';

interface OrderSummaryProps {
    cart: CartState;
    shippingInfo?: {
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, shippingInfo }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const shippingCost = cart.total > 100 ? 0 : 9.99;
    const tax = cart.total * 0.21; // 21% IVA
    const total = cart.total + shippingCost + tax;

    return (
        <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-white mb-4">Resumen del Pedido</h3>
            
            {/* Products */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cart.items.map((item) => (
                    <div key={`${item.id}-${item.itemType}`} className="flex justify-between text-sm">
                        <div className="flex-1">
                            <div className="text-gray-300">{item.name}</div>
                            <div className="text-gray-500">{item.quantity} × {formatPrice(item.price)}</div>
                        </div>
                        <div className="text-gray-300 font-medium">
                            {formatPrice(item.price * item.quantity)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-300">{formatPrice(cart.total)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Envío</span>
                    <span className="text-gray-300">
                        {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
                    </span>
                </div>
                
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">IVA (21%)</span>
                    <span className="text-gray-300">{formatPrice(tax)}</span>
                </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex justify-between">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-lg font-bold text-indigo-400">{formatPrice(total)}</span>
                </div>
                {shippingCost === 0 && cart.total > 0 && (
                    <div className="text-xs text-green-400 mt-1">
                        ? Envío gratuito en pedidos superiores a $100
                    </div>
                )}
            </div>

            {/* Shipping Info (if available) */}
            {shippingInfo && (
                <div className="border-t border-gray-700 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Dirección de Envío</h4>
                    <div className="text-xs text-gray-400 space-y-1">
                        <div>{shippingInfo.firstName} {shippingInfo.lastName}</div>
                        <div>{shippingInfo.address}</div>
                        <div>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</div>
                        <div>{shippingInfo.country}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
