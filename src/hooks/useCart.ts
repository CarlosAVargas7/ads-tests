import { useState, useEffect } from "react";
import { CartItem, CartState } from "../types/cart";
import { useAudienceTracking } from "./useAudienceTracking";
import { useUTMTracking } from "./useUTMTracking";
import { useUserAcquisitionTracking } from "./useUserAcquisitionTracking";

export const useCart = () => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    isOpen: false,
    total: 0,
  });

  const { trackAudienceEvent } = useAudienceTracking(cart);
  const { injectUTMData } = useUTMTracking();
  const { injectUserData } = useUserAcquisitionTracking();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart structure before setting
        if (
          parsedCart &&
          Array.isArray(parsedCart.items) &&
          typeof parsedCart.total === "number"
        ) {
          setCart(parsedCart);
          console.log(
            "?? Cart restored from localStorage:",
            parsedCart.items.length,
            "items",
          );

          // Track returning user with items in cart
          if (parsedCart.items.length > 0) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "cart_restored",
              cart_value: parsedCart.total,
              items_count: parsedCart.items.length,
              session_type: "returning_user",
            });
            console.log(
              "?? Returning user with cart items:",
              parsedCart.items.length,
              "items, $",
              parsedCart.total,
            );
          }
        } else {
          console.warn(
            "?? Invalid cart data in localStorage, using fresh cart",
          );
          localStorage.removeItem("cart");
        }
      }
    } catch (error) {
      console.error("?? Error loading cart from localStorage:", error);
      localStorage.removeItem("cart");
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      // Always save cart state (even if empty) for persistence
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("?? Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (cartItem) =>
          cartItem.id === item.id && cartItem.itemType === item.itemType,
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = prevCart.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem,
        );
      } else {
        // Add new item
        newItems = [...prevCart.items, item];
      }

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Track add_to_cart event - CRITICAL for Google Ads
      window.dataLayer = window.dataLayer || [];
      const addCartEvent = {
        event: "add_to_cart",
        ecommerce: {
          currency: "USD",
          value: item.price * item.quantity,
          items: [
            {
              item_name: item.name,
              item_id: item.id,
              price: item.price,
              item_category: item.category,
              item_variant: item.itemType,
              quantity: item.quantity,
            },
          ],
        },
      };

      // Inject UTM data
      const addCartEventWithUTM = injectUTMData(addCartEvent);

      // Inject user data
      const addCartEventWithUser = injectUserData(addCartEventWithUTM);

      // Add audience data
      trackAudienceEvent("add_to_cart_with_audience", {
        ecommerce: addCartEventWithUser.ecommerce,
      });

      window.dataLayer.push(addCartEventWithUser);

      console.log(
        `?? Add to Cart Event: ${item.name} (${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`,
      );

      return {
        ...prevCart,
        items: newItems,
        total: newTotal,
      };
    });
  };

  const removeFromCart = (itemId: string, itemType: "service" | "product") => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.items.find(
        (cartItem) => cartItem.id === itemId && cartItem.itemType === itemType,
      );

      if (!itemToRemove) return prevCart;

      const newItems = prevCart.items.filter(
        (cartItem) =>
          !(cartItem.id === itemId && cartItem.itemType === itemType),
      );

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Track remove_from_cart event
      window.dataLayer = window.dataLayer || [];
      const removeCartEvent = {
        event: "remove_from_cart",
        ecommerce: {
          currency: "USD",
          value: newTotal,
          items: [
            {
              item_name: itemToRemove.name,
              item_id: itemToRemove.id,
              price: itemToRemove.price,
              item_category: itemToRemove.category,
              item_variant: itemToRemove.itemType,
              quantity: itemToRemove.quantity,
            },
          ],
        },
      };

      // Inject UTM data
      const removeCartEventWithUTM = injectUTMData(removeCartEvent);
      window.dataLayer.push(removeCartEventWithUTM);

      console.log(`?? Removed from cart: ${itemToRemove.name}`);

      return {
        ...prevCart,
        items: newItems,
        total: newTotal,
      };
    });
  };

  const updateQuantity = (
    itemId: string,
    itemType: "service" | "product",
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(itemId, itemType);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((cartItem) =>
        cartItem.id === itemId && cartItem.itemType === itemType
          ? { ...cartItem, quantity }
          : cartItem,
      );

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Find the updated item for tracking
      const updatedItem = newItems.find(
        (item) => item.id === itemId && item.itemType === itemType,
      );

      // Track update_cart event
      if (updatedItem) {
        window.dataLayer = window.dataLayer || [];
        const updateCartEvent = {
          event: "update_cart",
          ecommerce: {
            currency: "USD",
            value: newTotal,
            items: [
              {
                item_name: updatedItem.name,
                item_id: updatedItem.id,
                price: updatedItem.price,
                item_category: updatedItem.category,
                item_variant: updatedItem.itemType,
                quantity: updatedItem.quantity,
              },
            ],
          },
        };

        // Inject UTM data
        const updateCartEventWithUTM = injectUTMData(updateCartEvent);
        window.dataLayer.push(updateCartEventWithUTM);

        console.log(
          `?? Updated Cart: ${updatedItem.name} (quantity: ${updatedItem.quantity})`,
        );
      }

      return {
        ...prevCart,
        items: newItems,
        total: newTotal,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      isOpen: false,
      total: 0,
    });
    localStorage.removeItem("cart");
    console.log("?? Cart cleared");
  };

  // Utility: Clear all cart data (for testing)
  const clearAllCartData = () => {
    clearCart();
    // Also clear any checkout data
    localStorage.removeItem("checkout_cart");
    console.log("?? All cart data cleared (including checkout data)");
  };

  // Utility: Get cart age for analytics
  const getCartAge = () => {
    const savedCart = localStorage.getItem("cart");
    if (!savedCart) return 0;

    try {
      const cartData = JSON.parse(savedCart);
      // Simple age tracking based on items length (could be enhanced with timestamps)
      return cartData.items.length > 0 ? 1 : 0; // 1 = has items, 0 = empty
    } catch {
      return 0;
    }
  };

  const toggleCart = () => {
    setCart((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const getItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearAllCartData,
    getCartAge,
    toggleCart,
    getItemCount,
  };
};
