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
// Development Tools (Commented for production)
// import { UTMTester } from './components/UTMTester';
// import { AudienceTester } from './components/AudienceTester';
// import { UserAcquisitionTester } from './components/UserAcquisitionTester';
// import { AttributionModelTester } from './components/AttributionModelTester';

// --- APP CONTENT ---
const AppContent: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, toggleCart, getItemCount } = useCartContext();
    useUTMTracking(); // Initialize UTM tracking but don't need to use the functions here
    useUserAcquisitionTracking(); // Initialize user acquisition tracking
    useAttributionModel(); // Initialize attribution model

    useEffect(() => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) { window.dataLayer.push(args); }
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
        });
        console.log('?? Consent Mode: Inicializado en Denied');
    }, []);

    return (
        <Router>
            <Navigation itemCount={getItemCount()} onToggleCart={toggleCart} />

            <Routes>
                <Route path="/ads-tests" element={
                    <div className="h-screen">
                        <HomePage />
                    </div>
                } />
                <Route path="/ads-tests/tienda" element={<TiendaPage />} />
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

            {/* Development Tools - Fixed Positions (Commented for production) */}
            {/* <div className="fixed top-4 right-4 z-50">
                <UTMTester />
            </div>
            <div className="fixed top-4 left-4 z-50">
                <AudienceTester />
            </div>
            <div className="fixed bottom-4 left-4 z-50">
                <UserAcquisitionTester />
            </div>
            <div className="fixed bottom-4 right-4 z-50">
                <AttributionModelTester />
            </div> */}
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
