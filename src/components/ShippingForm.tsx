import React, { useState, useEffect } from 'react';
import { ShippingInfo } from '../types/checkout';
import { useErrorTracking } from '../hooks/useErrorTracking';
import { useCartContext } from '../contexts/CartContext';

interface ShippingFormProps {
    shippingInfo: ShippingInfo;
    onUpdate: (info: Partial<ShippingInfo>) => void;
    onValidationChange: (isValid: boolean) => void;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
    shippingInfo,
    onUpdate,
    onValidationChange
}) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());
    const { cart } = useCartContext();
    const trackCheckoutError = useErrorTracking();

    const validateField = (name: keyof ShippingInfo, value: string): string | undefined => {
        if (!value || value.trim() === '') {
            return 'Este campo es obligatorio';
        }

        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Email inválido';
                }
                break;
            case 'phone':
                const phoneRegex = /^[+]?[\d\s-()]+$/;
                if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 9) {
                    return 'Teléfono inválido';
                }
                break;
            case 'zipCode':
                const zipRegex = /^\d{5}$/;
                if (!zipRegex.test(value)) {
                    return 'Código postal inválido (5 dígitos)';
                }
                break;
        }

        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        Object.keys(shippingInfo).forEach((key) => {
            const error = validateField(key as keyof ShippingInfo, shippingInfo[key as keyof ShippingInfo]);
            if (error) {
                newErrors[key as keyof FormErrors] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        const isValid = validateForm();
        onValidationChange(isValid);
    }, [shippingInfo]);

    const handleInputChange = (field: keyof ShippingInfo, value: string) => {
        onUpdate({ [field]: value });

        if (touched.has(field)) {
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const handleBlur = (field: keyof ShippingInfo) => {
        setTouched(prev => new Set(prev).add(field));
        const error = validateField(field, shippingInfo[field]);
        setErrors(prev => ({ ...prev, [field]: error }));

        // Track validation errors
        if (error && touched.has(field)) {
            trackCheckoutError({
                checkout_step: 'shipping',
                error_type: 'validation',
                error_message: error,
                field_name: field,
                cart_value: cart.total,
                cart_items_count: cart.items.length,
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });
        }
    };

    const getFieldClassName = (field: keyof ShippingInfo) => {
        const baseClass = "w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";
        const errorClass = errors[field] ? "border-red-500" : "border-gray-600";
        return `${baseClass} ${errorClass}`;
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                        placeholder="Juan"
                        className={getFieldClassName('firstName')}
                    />
                    {errors.firstName && (
                        <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Apellidos *
                    </label>
                    <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                        placeholder="Pérez"
                        className={getFieldClassName('lastName')}
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        placeholder="juan@ejemplo.com"
                        className={getFieldClassName('email')}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Teléfono *
                    </label>
                    <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        placeholder="+34 600 123 456"
                        className={getFieldClassName('phone')}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Dirección *
                </label>
                <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    placeholder="Calle Principal, 123"
                    className={getFieldClassName('address')}
                />
                {errors.address && (
                    <p className="mt-1 text-xs text-red-400">{errors.address}</p>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Ciudad *
                    </label>
                    <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                        placeholder="Madrid"
                        className={getFieldClassName('city')}
                    />
                    {errors.city && (
                        <p className="mt-1 text-xs text-red-400">{errors.city}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Provincia *
                    </label>
                    <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        onBlur={() => handleBlur('state')}
                        placeholder="Madrid"
                        className={getFieldClassName('state')}
                    />
                    {errors.state && (
                        <p className="mt-1 text-xs text-red-400">{errors.state}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        C.P. *
                    </label>
                    <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value.replace(/\D/g, ''))}
                        onBlur={() => handleBlur('zipCode')}
                        placeholder="28001"
                        maxLength={5}
                        className={getFieldClassName('zipCode')}
                    />
                    {errors.zipCode && (
                        <p className="mt-1 text-xs text-red-400">{errors.zipCode}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        País *
                    </label>
                    <select
                        value={shippingInfo.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={getFieldClassName('country')}
                    >
                        <option value="ES">España</option>
                        <option value="PT">Portugal</option>
                        <option value="FR">Francia</option>
                        <option value="IT">Italia</option>
                        <option value="DE">Alemania</option>
                        <option value="UK">Reino Unido</option>
                    </select>
                    {errors.country && (
                        <p className="mt-1 text-xs text-red-400">{errors.country}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
