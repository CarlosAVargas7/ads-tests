import { useEffect } from 'react';
import { useCartContext } from '../contexts/CartContext';
import { useEcommerceFunnelTracking } from '../hooks/useEcommerceFunnelTracking';

interface FunnelIntegrationProps {
  currentPage: string;
  currentItem?: {
    name: string;
    id: string;
    price: number;
    category: string;
    itemType: 'service' | 'product';
  };
}

export const FunnelIntegration: React.FC<FunnelIntegrationProps> = ({
  currentPage,
  currentItem
}) => {
  const { cart } = useCartContext();
  const {
    trackViewItem,
    trackViewCart,
    trackBeginCheckout,
    trackAddPaymentInfo,
    trackFunnelStep
  } = useEcommerceFunnelTracking(cart);

  // Track page-specific funnel events
  useEffect(() => {
    switch (currentPage) {
      case 'tienda':
        // Track view_item when viewing product details
        if (currentItem) {
          trackViewItem(currentItem);
          trackFunnelStep(1, 'awareness');
        }
        break;

      case 'cart':
        // Track view_cart when cart opens
        if (cart.isOpen && cart.items.length > 0) {
          trackViewCart();
          trackFunnelStep(4, 'conversion');
        }
        break;

      case 'checkout':
        // Track begin_checkout when entering checkout
        if (cart.items.length > 0) {
          trackBeginCheckout();
          trackFunnelStep(5, 'conversion');
        }
        break;

      case 'payment':
        // Track add_payment_info when payment info is complete
        if (cart.items.length > 0) {
          trackAddPaymentInfo();
          trackFunnelStep(6, 'conversion');
        }
        break;

      case 'success':
        // Track funnel completion
        trackFunnelStep(7, 'purchase');
        break;
    }
  }, [currentPage, currentItem, cart, trackViewItem, trackViewCart, trackBeginCheckout, trackAddPaymentInfo, trackFunnelStep]);

  // Track add_to_cart when items are added to cart
  useEffect(() => {
    // This will be called when cart items change
    // The actual add_to_cart tracking should be called from the component that adds items
  }, [cart.items]);

  return null; // This is a tracking-only component
};

// Hook to easily trigger add_to_cart from any component
export const useFunnelAddToCart = () => {
  const { cart } = useCartContext();
  const { trackAddToCart } = useEcommerceFunnelTracking(cart);

  const addItemToCartWithTracking = (
    item: {
      name: string;
      id: string;
      price: number;
      category: string;
      itemType: 'service' | 'product';
      quantity: number;
    }
  ) => {
    // Track the add_to_cart event
    trackAddToCart(item);

    // You can also add the item to the cart context here
    // This would integrate with your existing cart logic
    console.log('?? Funnel Add to Cart Tracked:', {
      item_name: item.name,
      quantity: item.quantity,
      value: item.price * item.quantity
    });
  };

  return { addItemToCartWithTracking };
};
