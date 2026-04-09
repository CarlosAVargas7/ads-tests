import { useCallback } from 'react';
import { CartState } from '../types/cart';
import { useUTMTracking } from './useUTMTracking';
import { useUserAcquisitionTracking } from './useUserAcquisitionTracking';
import { useAudienceTracking } from './useAudienceTracking';

export interface FunnelEvent {
  event: string;
  ecommerce: {
    currency: string;
    value: number;
    transaction_id?: string;
    items: Array<{
      item_name: string;
      item_id: string;
      price: number;
      item_category: string;
      item_variant: string;
      quantity: number;
    }>;
  };
  // UTM Data
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  utm_timestamp?: number;
  // User Data
  user_id?: string;
  traffic_source?: string;
  first_touch_source?: string;
  user_acquisition_source?: string;
  total_sessions?: number;
  user_type?: string;
  // Audience Data
  cart_value_bucket?: string;
  engagement_level?: string;
  // Funnel Context
  funnel_step: number;
  funnel_stage: string;
  session_id?: string;
  timestamp: number;
}

export const useEcommerceFunnelTracking = (cart: CartState) => {
  const { getStoredUTMData } = useUTMTracking();
  const { getUserAcquisitionData } = useUserAcquisitionTracking();
  const { getAudienceData } = useAudienceTracking(cart);

  // Generate unique session ID
  const getOrCreateSessionId = (): string => {
    let sessionId = sessionStorage.getItem('funnel_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('funnel_session_id', sessionId);
    }
    return sessionId;
  };

  // Create base event structure with all tracking data
  const createBaseEvent = useCallback((
    eventName: string,
    items: Array<{
      item_name: string;
      item_id: string;
      price: number;
      item_category: string;
      item_variant: string;
      quantity: number;
    }>,
    value: number,
    funnelStep: number,
    funnelStage: string
  ): FunnelEvent => {
    const utmData = getStoredUTMData();
    const userData = getUserAcquisitionData();
    const audienceData = getAudienceData();

    // Create base event
    const event: FunnelEvent = {
      event: eventName,
      ecommerce: {
        currency: 'USD',
        value: value,
        items: items
      },
      funnel_step: funnelStep,
      funnel_stage: funnelStage,
      session_id: getOrCreateSessionId(),
      timestamp: Date.now()
    };

    // Add UTM data if available
    if (utmData) {
      event.utm_source = utmData.utm_source;
      event.utm_campaign = utmData.utm_campaign;
      event.utm_medium = utmData.utm_medium;
      event.utm_term = utmData.utm_term;
      event.utm_content = utmData.utm_content;
      event.utm_timestamp = utmData.timestamp;
    }

    // Add user acquisition data if available
    if (userData) {
      event.user_id = userData.user_id;
      event.traffic_source = userData.last_touch.source;
      event.first_touch_source = userData.first_touch.source;
      event.user_acquisition_source = userData.user_acquisition_source;
      event.total_sessions = userData.total_sessions;
      event.user_type = userData.total_sessions === 1 ? 'new' : 'returning';
    }

    // Add audience data if available
    if (audienceData) {
      event.cart_value_bucket = audienceData.cart_value_bucket;
      event.engagement_level = audienceData.engagement_level;
    }

    return event;
  }, [getStoredUTMData, getUserAcquisitionData, getAudienceData]);

  // Track view_item event
  const trackViewItem = useCallback((
    item: {
      name: string;
      id: string;
      price: number;
      category: string;
      itemType: 'service' | 'product';
    }
  ) => {
    const event = createBaseEvent('view_item', [{
      item_name: item.name,
      item_id: item.id,
      price: item.price,
      item_category: item.category,
      item_variant: item.itemType,
      quantity: 1
    }], item.price, 1, 'awareness');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);

    console.log('?? Funnel Event - View Item:', {
      event: event.event,
      item_name: item.name,
      value: item.price,
      utm_source: event.utm_source,
      user_type: event.user_type,
      funnel_step: event.funnel_step
    });
  }, [createBaseEvent]);

  // Track add_to_cart event
  const trackAddToCart = useCallback((
    item: {
      name: string;
      id: string;
      price: number;
      category: string;
      itemType: 'service' | 'product';
      quantity: number;
    }
  ) => {
    const event = createBaseEvent('add_to_cart', [{
      item_name: item.name,
      item_id: item.id,
      price: item.price,
      item_category: item.category,
      item_variant: item.itemType,
      quantity: item.quantity
    }], item.price * item.quantity, 3, 'conversion');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);

    console.log('?? Funnel Event - Add to Cart:', {
      event: event.event,
      item_name: item.name,
      quantity: item.quantity,
      value: item.price * item.quantity,
      utm_source: event.utm_source,
      user_type: event.user_type,
      funnel_step: event.funnel_step
    });
  }, [createBaseEvent]);

  // Track view_cart event
  const trackViewCart = useCallback(() => {
    if (cart.items.length === 0) return;

    const event = createBaseEvent('view_cart', cart.items.map(item => ({
      item_name: item.name,
      item_id: item.id,
      price: item.price,
      item_category: item.category,
      item_variant: item.itemType,
      quantity: item.quantity
    })), cart.total, 4, 'conversion');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);

    console.log('?? Funnel Event - View Cart:', {
      event: event.event,
      items_count: cart.items.length,
      value: cart.total,
      utm_source: event.utm_source,
      user_type: event.user_type,
      funnel_step: event.funnel_step
    });
  }, [createBaseEvent, cart]);

  // Track begin_checkout event
  const trackBeginCheckout = useCallback(() => {
    if (cart.items.length === 0) return;

    const event = createBaseEvent('begin_checkout', cart.items.map(item => ({
      item_name: item.name,
      item_id: item.id,
      price: item.price,
      item_category: item.category,
      item_variant: item.itemType,
      quantity: item.quantity
    })), cart.total, 5, 'conversion');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);

    console.log('?? Funnel Event - Begin Checkout:', {
      event: event.event,
      items_count: cart.items.length,
      value: cart.total,
      utm_source: event.utm_source,
      user_type: event.user_type,
      funnel_step: event.funnel_step
    });
  }, [createBaseEvent, cart]);

  // Track add_payment_info event
  const trackAddPaymentInfo = useCallback(() => {
    if (cart.items.length === 0) return;

    const event = createBaseEvent('add_payment_info', cart.items.map(item => ({
      item_name: item.name,
      item_id: item.id,
      price: item.price,
      item_category: item.category,
      item_variant: item.itemType,
      quantity: item.quantity
    })), cart.total, 6, 'conversion');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);

    console.log('?? Funnel Event - Add Payment Info:', {
      event: event.event,
      items_count: cart.items.length,
      value: cart.total,
      utm_source: event.utm_source,
      user_type: event.user_type,
      funnel_step: event.funnel_step
    });
  }, [createBaseEvent, cart]);

  // Track purchase event
  const trackPurchase = useCallback((transactionId: string) => {
    const cartData = localStorage.getItem('checkout_cart');
    if (!cartData) return;

    const checkoutCart = JSON.parse(cartData);
    if (!checkoutCart.items || checkoutCart.items.length === 0) return;

    const event = createBaseEvent(
      'purchase',
      checkoutCart.items.map((item: any) => ({
        item_name: item.name,
        item_id: item.id,
        price: item.price,
        item_category: item.category,
        item_variant: item.itemType,
        quantity: item.quantity,
      })),
      checkoutCart.total,
      7,
      'purchase',
    );

    // Add transaction_id to purchase event
    event.ecommerce.transaction_id = transactionId;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);

    console.log('?? Funnel Event - Purchase:', {
      event: event.event,
      transaction_id: transactionId,
      items_count: checkoutCart.items.length,
      value: checkoutCart.total,
      utm_source: event.utm_source,
      user_type: event.user_type,
      funnel_step: event.funnel_step,
    });

    // Clean up cart data after purchase
    localStorage.removeItem('checkout_cart');
  }, [createBaseEvent]);

  // Track funnel step completion
  const trackFunnelStep = useCallback((step: number, stage: string) => {
    const utmData = getStoredUTMData();
    const userData = getUserAcquisitionData();
    const audienceData = getAudienceData();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'funnel_step_completed',
      funnel_step: step,
      funnel_stage: stage,
      session_id: getOrCreateSessionId(),
      timestamp: Date.now(),
      utm_source: utmData?.utm_source,
      utm_campaign: utmData?.utm_campaign,
      user_type: userData?.total_sessions === 1 ? 'new' : 'returning',
      engagement_level: audienceData?.engagement_level,
      cart_value_bucket: audienceData?.cart_value_bucket,
    });
  }, [getStoredUTMData, getUserAcquisitionData, getAudienceData]);

  return {
    trackViewItem,
    trackAddToCart,
    trackViewCart,
    trackBeginCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackFunnelStep,
  };
};
