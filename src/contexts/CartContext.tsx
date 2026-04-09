import React, { createContext, useContext, ReactNode } from 'react';
import { useCart } from '../hooks/useCart';
import { CartState } from '../types/cart';

interface CartContextType {
    cart: CartState;
    addToCart: (item: any) => void;
    removeFromCart: (itemId: string, itemType: 'service' | 'product') => void;
    updateQuantity: (itemId: string, itemType: 'service' | 'product', quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const cartHook = useCart();

    return (
        <CartContext.Provider value={cartHook}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};
