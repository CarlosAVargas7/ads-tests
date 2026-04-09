import React, { useState } from 'react';
import { CheckoutState } from '../types/checkout';
import { CheckoutProgress } from './CheckoutProgress';
import { OrderSummary } from './OrderSummary';
import { ShippingForm } from './ShippingForm';
import { PaymentForm } from './PaymentForm';
import { useCartContext } from '../contexts/CartContext';

interface CheckoutProps {
    checkoutState: CheckoutState;
    onShippingInfoUpdate: (info: any) => void;
    onPaymentInfoUpdate: (info: any) => void;
    onNextStep: () => void;
    onPreviousStep: () => void;
    onStepClick: (stepId: 'shipping' | 'payment' | 'confirmation') => void;
    onCompleteCheckout: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
    checkoutState,
    onShippingInfoUpdate,
    onPaymentInfoUpdate,
    onNextStep,
    onPreviousStep,
    onStepClick,
    onCompleteCheckout
}) => {
    const { cart, clearCart } = useCartContext();
    const [isShippingValid, setIsShippingValid] = useState(false);
    const [isPaymentValid, setIsPaymentValid] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const handleCompleteCheckout = async () => {
        await onCompleteCheckout();
        clearCart();
    };

    const canProceedToNext = () => {
        switch (checkoutState.currentStep) {
            case 'shipping':
                return isShippingValid;
            case 'payment':
                return isPaymentValid;
            case 'confirmation':
                return true;
            default:
                return false;
        }
    };

    const renderStepContent = () => {
        switch (checkoutState.currentStep) {
            case 'shipping':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Información de Envío</h2>
                            <p className="text-gray-400">Completa tus datos de contacto y dirección de envío</p>
                        </div>

                        <ShippingForm
                            shippingInfo={checkoutState.shippingInfo}
                            onUpdate={onShippingInfoUpdate}
                            onValidationChange={setIsShippingValid}
                        />
                    </div>
                );

            case 'payment':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Método de Pago</h2>
                            <p className="text-gray-400">Ingresa los datos de tu tarjeta de forma segura</p>
                        </div>

                        <PaymentForm
                            paymentInfo={checkoutState.paymentInfo}
                            onUpdate={onPaymentInfoUpdate}
                            onValidationChange={setIsPaymentValid}
                        />
                    </div>
                );

            case 'confirmation':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Confirmación del Pedido</h2>
                            <p className="text-gray-400">Revisa todos los detalles antes de finalizar tu compra</p>
                        </div>

                        {/* Order Details */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Detalles del Envío</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Nombre:</span>
                                    <span className="ml-2 text-white">
                                        {checkoutState.shippingInfo.firstName} {checkoutState.shippingInfo.lastName}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Email:</span>
                                    <span className="ml-2 text-white">{checkoutState.shippingInfo.email}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Teléfono:</span>
                                    <span className="ml-2 text-white">{checkoutState.shippingInfo.phone}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Dirección:</span>
                                    <span className="ml-2 text-white">
                                        {checkoutState.shippingInfo.address}, {checkoutState.shippingInfo.city}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Método de Pago</h3>
                            <div className="text-sm">
                                <div className="text-gray-400">Tarjeta terminada en:</div>
                                <div className="text-white font-mono">
                                    **** **** **** {checkoutState.paymentInfo.cardNumber.slice(-4)}
                                </div>
                                <div className="text-gray-400 mt-1">Titular: {checkoutState.paymentInfo.cardHolder}</div>
                            </div>
                        </div>

                        {/* Products Summary */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Productos</h3>
                            <div className="space-y-2">
                                {cart.items.map((item) => (
                                    <div key={`${item.id}-${item.itemType}`} className="flex justify-between text-sm">
                                        <div>
                                            <div className="text-white">{item.name}</div>
                                            <div className="text-gray-400">{item.quantity} × {formatPrice(item.price)}</div>
                                        </div>
                                        <div className="text-white font-medium">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderStepActions = () => {
        const fillFormForTesting = () => {
            switch (checkoutState.currentStep) {
                case 'shipping':
                    onShippingInfoUpdate({
                        firstName: 'John',
                        lastName: 'Smith',
                        email: 'john.smith@example.com',
                        phone: '+1 555 123 4567',
                        address: '123 Main St',
                        city: 'New York',
                        state: 'NY',
                        zipCode: '10001',
                        country: 'US'
                    });
                    break;
                case 'payment':
                    onPaymentInfoUpdate({
                        cardNumber: '4242 4242 4242 4242',
                        cardHolder: 'JOHN SMITH',
                        expiryDate: '12/30',
                        cvv: '123',
                        saveCard: false
                    });
                    break;
                default:
                    break;
            }
        };

        return (
            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                <button
                    onClick={onPreviousStep}
                    disabled={checkoutState.currentStep === 'shipping'}
                    className={`
                        px-6 py-3 rounded-lg font-medium transition-colors
                        ${checkoutState.currentStep === 'shipping'
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                    `}
                >
                    Anterior
                </button>

                <div className="flex items-center space-x-4">
                    {/* Fill Form Button (Testing Only) */}
                    {(checkoutState.currentStep === 'shipping' || checkoutState.currentStep === 'payment') && (
                        <button
                            onClick={fillFormForTesting}
                            className="px-4 py-3 bg-yellow-600 text-yellow-100 rounded-lg font-medium hover:bg-yellow-700 transition-colors text-sm"
                            title="Rellenar formulario para testing"
                        >
                            ? Rellenar Form
                        </button>
                    )}

                    {checkoutState.currentStep === 'confirmation' ? (
                        <button
                            onClick={handleCompleteCheckout}
                            disabled={checkoutState.isProcessing}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {checkoutState.isProcessing ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </span>
                            ) : (
                                'Completar Compra'
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={onNextStep}
                            disabled={!canProceedToNext()}
                            className={`
                                px-6 py-3 rounded-lg font-medium transition-colors
                                ${canProceedToNext()
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }
                            `}
                        >
                            Siguiente
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
                    <p className="text-gray-400">Finaliza tu compra en 3 simples pasos</p>
                </div>

                {/* Progress Bar */}
                <CheckoutProgress
                    checkoutState={checkoutState}
                    onStepClick={onStepClick}
                />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Forms */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg p-6">
                            {renderStepContent()}
                            {renderStepActions()}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            cart={cart}
                            shippingInfo={
                                checkoutState.currentStep === 'confirmation' ? checkoutState.shippingInfo : undefined
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
