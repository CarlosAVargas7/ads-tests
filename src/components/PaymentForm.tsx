import React, { useState, useEffect } from 'react';
import { PaymentInfo } from '../types/checkout';
import { useErrorTracking } from '../hooks/useErrorTracking';
import { useCartContext } from '../contexts/CartContext';

interface PaymentFormProps {
    paymentInfo: PaymentInfo;
    onUpdate: (info: Partial<PaymentInfo>) => void;
    onValidationChange: (isValid: boolean) => void;
}

interface FormErrors {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
    paymentInfo,
    onUpdate,
    onValidationChange
}) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());
    const { cart } = useCartContext();
    const trackCheckoutError = useErrorTracking();

    const validateField = (name: keyof PaymentInfo, value: string | boolean): string | undefined => {
        if (typeof value === 'boolean') return undefined;
        if (!value || (value as string).trim() === '') {
            return 'Este campo es obligatorio';
        }

        switch (name) {
            case 'cardNumber':
                const cardNumber = (value as string).replace(/\s/g, '');
                if (!/^\d+$/.test(cardNumber)) {
                    return 'Solo se permiten números';
                }
                if (cardNumber.length < 13 || cardNumber.length > 19) {
                    return 'Número de tarjeta inválido';
                }
                break;
            case 'cardHolder':
                if (!/^[a-zA-Z\s]+$/.test(value as string)) {
                    return 'Solo se permiten letras y espacios';
                }
                if ((value as string).length < 3) {
                    return 'Nombre demasiado corto';
                }
                break;
            case 'expiryDate':
                const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
                if (!expiryRegex.test(value as string)) {
                    return 'Formato inválido (MM/AA)';
                }
                // Check if date is in the future
                const [month, year] = (value as string).split('/');
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear() % 100;
                const currentMonth = currentDate.getMonth() + 1;
                const expYear = parseInt(year);
                const expMonth = parseInt(month);

                if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                    return 'Tarjeta expirada';
                }
                break;
            case 'cvv':
                const cvvRegex = /^\d{3,4}$/;
                if (!cvvRegex.test(value as string)) {
                    return 'CVV inválido (3-4 dígitos)';
                }
                break;
        }

        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        (['cardNumber', 'cardHolder', 'expiryDate', 'cvv'] as const).forEach((key) => {
            const error = validateField(key, paymentInfo[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        const isValid = validateForm();
        onValidationChange(isValid);
    }, [paymentInfo]);

    const handleInputChange = (field: keyof PaymentInfo, value: string) => {
        if (field === 'cardNumber') {
            // Format card number with spaces every 4 digits
            const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            onUpdate({ [field]: formatted });
        } else if (field === 'expiryDate') {
            // Format expiry date as MM/AA
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length >= 2) {
                const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
                onUpdate({ [field]: formatted });
            } else {
                onUpdate({ [field]: cleaned });
            }
        } else if (field === 'cvv') {
            // Only allow numbers
            const cleaned = value.replace(/\D/g, '');
            onUpdate({ [field]: cleaned });
        } else {
            onUpdate({ [field]: value });
        }

        if (touched.has(field)) {
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const handleBlur = (field: keyof PaymentInfo) => {
        setTouched(prev => new Set(prev).add(field));
        if (field !== 'saveCard') {
            const error = validateField(field, paymentInfo[field]);
            setErrors(prev => ({ ...prev, [field]: error }));

            // Track validation errors
            if (error && touched.has(field)) {
                trackCheckoutError({
                    checkout_step: 'payment',
                    error_type: 'validation',
                    error_message: error,
                    field_name: field,
                    cart_value: cart.total,
                    cart_items_count: cart.items.length,
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                });
            }
        }
    };

    const getFieldClassName = (field: keyof PaymentInfo) => {
        const baseClass = "w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";
        const errorClass = field !== 'saveCard' && errors[field] ? "border-red-500" : "border-gray-600";
        return `${baseClass} ${errorClass}`;
    };

    const getCardType = (cardNumber: string): string => {
        const number = cardNumber.replace(/\s/g, '');
        if (number.startsWith('4')) return 'visa';
        if (number.startsWith('5')) return 'mastercard';
        if (number.startsWith('3')) return 'amex';
        return 'unknown';
    };

    const cardType = getCardType(paymentInfo.cardNumber);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Número de Tarjeta *
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        onBlur={() => handleBlur('cardNumber')}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`${getFieldClassName('cardNumber')} pr-12`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {cardType === 'visa' && (
                            <svg className="w-8 h-5 text-blue-400" viewBox="0 0 24 16" fill="currentColor">
                                <rect width="24" height="16" rx="2" fill="#1A1F71" />
                                <text x="12" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">VISA</text>
                            </svg>
                        )}
                        {cardType === 'mastercard' && (
                            <svg className="w-8 h-5 text-red-400" viewBox="0 0 24 16" fill="currentColor">
                                <rect width="24" height="16" rx="2" fill="#EB001B" />
                                <text x="12" y="11" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">MC</text>
                            </svg>
                        )}
                        {cardType === 'amex' && (
                            <svg className="w-8 h-5 text-blue-600" viewBox="0 0 24 16" fill="currentColor">
                                <rect width="24" height="16" rx="2" fill="#006FCF" />
                                <text x="12" y="11" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">AMEX</text>
                            </svg>
                        )}
                    </div>
                </div>
                {errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-400">{errors.cardNumber}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Titular de la Tarjeta *
                </label>
                <input
                    type="text"
                    value={paymentInfo.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                    onBlur={() => handleBlur('cardHolder')}
                    placeholder="JUAN PÉREZ"
                    className={getFieldClassName('cardHolder')}
                />
                {errors.cardHolder && (
                    <p className="mt-1 text-xs text-red-400">{errors.cardHolder}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Fecha de Caducidad *
                    </label>
                    <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        onBlur={() => handleBlur('expiryDate')}
                        placeholder="MM/AA"
                        maxLength={5}
                        className={getFieldClassName('expiryDate')}
                    />
                    {errors.expiryDate && (
                        <p className="mt-1 text-xs text-red-400">{errors.expiryDate}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        CVV *
                    </label>
                    <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        onBlur={() => handleBlur('cvv')}
                        placeholder="123"
                        maxLength={4}
                        className={getFieldClassName('cvv')}
                    />
                    {errors.cvv && (
                        <p className="mt-1 text-xs text-red-400">{errors.cvv}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="saveCard"
                    checked={paymentInfo.saveCard}
                    onChange={(e) => onUpdate({ saveCard: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <label htmlFor="saveCard" className="ml-2 text-sm text-gray-300">
                    Guardar tarjeta para futuras compras
                </label>
            </div>

            {/* Security Notice */}
            <div className="bg-gray-700 rounded-lg p-3 mt-4">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-300">
                        Tu información de pago está encriptada y segura. Nunca almacenamos los datos de tu tarjeta.
                    </span>
                </div>
            </div>
        </div>
    );
};
