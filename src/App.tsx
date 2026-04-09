import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import { Navigation } from './components/Navigation';
import { CookieConsent } from './components/CookieConsent';
import { Cart } from './components/Cart';

// Contexts
import { CartProvider, useCartContext } from './contexts/CartContext';

// Hooks
import { useUTMTracking } from './hooks/useUTMTracking';
import { useUserAcquisitionTracking } from './hooks/useUserAcquisitionTracking';
import { useAttributionModel } from './hooks/useAttributionModel';

// Pages
import { HomePage } from './pages/HomePage';
import { TiendaPage } from './pages/TiendaPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CheckoutSuccess } from './pages/CheckoutSuccess';

// --- APP CONTENT ---
const AppContent: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, toggleCart, getItemCount } = useCartContext();
    useUTMTracking(); // Initialize UTM tracking but don't need to use the functions here
    useUserAcquisitionTracking(); // Initialize user acquisition tracking
    useAttributionModel(); // Initialize attribution model

    // Consent Mode - Versión recomendada con GTM (más ligera)
    useEffect(() => {
        // Solo seteamos default en denied (el update lo hará tu CookieConsent)
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'consent_default',
            ad_storage: "denied",
            analytics_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            functionality_storage: "denied",
            personalization_storage: "denied",
            security_storage: "granted"
        });

        console.log('✅ Consent Mode v2: Default = Denied');
    }, []);

    return (
        <Router basename="/ads-tests">
            <Navigation itemCount={getItemCount()} onToggleCart={toggleCart} />

            <Routes>
                <Route path="/" element={
                    <div className="h-screen">
                        <HomePage />
                    </div>
                } />
                <Route path="/tienda" element={<TiendaPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
            </Routes>

            <CookieConsent />

            {/* Cart Sidebar */}
            {cart.isOpen && (
                <Cart
                    cart={cart}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onClear={clearCart}
                    onClose={toggleCart}
                />
            )}

        </Router>
    );
};

// --- APP PRINCIPAL ---
const App: React.FC = () => {
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
};

export default App;
