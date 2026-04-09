import { useEffect } from "react";
import { CartState } from "../types/cart";

export interface AudienceData {
  // Core user classification
  user_type:
    | "new"
    | "returning"
    | "buyer"
    | "browser"
    | "engaged_user"
    | "high_value_user";
  cart_value_bucket: "low" | "medium" | "high" | "none";
  engagement_level: "low" | "medium" | "high";

  // Behavioral metrics
  session_count: number;
  total_purchases: number;
  total_page_views: number;
  visited_pages: string[];
  time_on_site: number; // minutes
  last_visit: number;
  first_visit: number;

  // Cart metrics
  cart_items_count: number;
  cart_abandon_count: number;
  cart_add_count: number;
  total_cart_value: number;
  average_cart_value: number;

  // Product interaction metrics
  products_viewed: string[];
  categories_viewed: string[];
  last_product_view: string;
  product_views_count: number;

  // Engagement metrics
  scroll_depth: number; // percentage
  form_interactions: number;
  button_clicks: number;
  time_to_first_action: number; // seconds

  // Purchase metrics
  average_order_value: number;
  purchase_frequency: string; // 'one_time' | 'repeat' | 'loyal'
  days_since_last_purchase: number;
  customer_lifetime_value: number;

  // Device and technical metrics
  device_type: "desktop" | "mobile" | "tablet";
  browser: string;
  operating_system: string;

  // Time metrics
  days_since_first_visit: number;
  hours_since_last_visit: number;
  is_active_user: boolean;
}

export const useAudienceTracking = (cart: CartState) => {
  const getAudienceData = (): AudienceData => {
    try {
      // Get stored audience data
      const stored = localStorage.getItem("audience_data");
      const audienceData: AudienceData = stored
        ? JSON.parse(stored)
        : {
            user_type: "new",
            cart_value_bucket: "none",
            session_count: 0,
            total_purchases: 0,
            last_visit: Date.now(),
            cart_items_count: 0,
            engagement_level: "low",
          };

      // Update session data
      const currentTime = Date.now();
      const timeSinceLastVisit = currentTime - audienceData.last_visit;
      const isNewSession = timeSinceLastVisit > 30 * 60 * 1000; // 30 minutes

      if (isNewSession) {
        audienceData.session_count += 1;
        audienceData.last_visit = currentTime;
      }

      // Enhanced user type determination
      if (audienceData.total_purchases >= 3) {
        audienceData.user_type = "high_value_user";
      } else if (audienceData.total_purchases > 0) {
        audienceData.user_type = "buyer";
      } else if (
        audienceData.total_purchases === 0 &&
        audienceData.session_count >= 3 &&
        audienceData.total_page_views >= 10 &&
        audienceData.time_on_site >= 5
      ) {
        audienceData.user_type = "engaged_user";
      } else if (audienceData.session_count > 1) {
        audienceData.user_type = "returning";
      } else {
        audienceData.user_type = "new";
      }

      // Enhanced cart value bucket determination
      if (cart.items.length === 0) {
        audienceData.cart_value_bucket = "none";
      } else if (cart.total < 50) {
        audienceData.cart_value_bucket = "low";
      } else if (cart.total < 200) {
        audienceData.cart_value_bucket = "medium";
      } else {
        audienceData.cart_value_bucket = "high";
      }

      // Update cart metrics
      audienceData.cart_items_count = cart.items.length;
      audienceData.total_cart_value = cart.total;
      audienceData.average_cart_value =
        audienceData.cart_add_count > 0
          ? audienceData.total_cart_value / audienceData.cart_add_count
          : 0;

      // Enhanced engagement level determination
      const hasHighIntentActions =
        audienceData.form_interactions > 0 || audienceData.button_clicks > 3;
      const hasGoodEngagement =
        audienceData.scroll_depth > 50 ||
        audienceData.time_on_site > 3 ||
        audienceData.product_views_count > 3;

      if (hasHighIntentActions || audienceData.total_purchases > 0) {
        audienceData.engagement_level = "high";
      } else if (hasGoodEngagement || audienceData.session_count > 2) {
        audienceData.engagement_level = "medium";
      } else {
        audienceData.engagement_level = "low";
      }

      // Update time metrics
      audienceData.days_since_first_visit = Math.floor(
        (currentTime - audienceData.first_visit) / (1000 * 60 * 60 * 24),
      );
      audienceData.hours_since_last_visit = Math.floor(
        (currentTime - audienceData.last_visit) / (1000 * 60 * 60),
      );
      audienceData.is_active_user = audienceData.hours_since_last_visit <= 48;

      // Save updated data
      localStorage.setItem("audience_data", JSON.stringify(audienceData));

      return audienceData;
    } catch (error) {
      console.error("?? Error getting audience data:", error);
      return {
        user_type: "new",
        cart_value_bucket: "none",
        engagement_level: "low",
        // Behavioral metrics
        session_count: 0,
        total_purchases: 0,
        total_page_views: 0,
        visited_pages: [],
        time_on_site: 0,
        last_visit: Date.now(),
        first_visit: Date.now(),
        // Cart metrics
        cart_items_count: 0,
        cart_abandon_count: 0,
        cart_add_count: 0,
        total_cart_value: 0,
        average_cart_value: 0,
        // Product interaction metrics
        products_viewed: [],
        categories_viewed: [],
        last_product_view: "",
        product_views_count: 0,
        // Engagement metrics
        scroll_depth: 0,
        form_interactions: 0,
        button_clicks: 0,
        time_to_first_action: 0,
        // Purchase metrics
        average_order_value: 0,
        purchase_frequency: "one_time",
        days_since_last_purchase: 0,
        customer_lifetime_value: 0,
        // Device and technical metrics
        device_type: "desktop",
        browser: "unknown",
        operating_system: "unknown",
        // Time metrics
        days_since_first_visit: 0,
        hours_since_last_visit: 0,
        is_active_user: false,
      };
    }
  };

  const trackAudienceEvent = (eventName: string, additionalData?: any) => {
    const audienceData = getAudienceData();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      user_type: audienceData.user_type,
      cart_value_bucket: audienceData.cart_value_bucket,
      session_count: audienceData.session_count,
      total_purchases: audienceData.total_purchases,
      cart_items_count: audienceData.cart_items_count,
      engagement_level: audienceData.engagement_level,
      ...additionalData,
    });
  };

  const trackPurchase = (purchaseValue: number) => {
    const audienceData = getAudienceData();

    // Update purchase data
    audienceData.total_purchases += 1;
    audienceData.user_type = "buyer";
    localStorage.setItem("audience_data", JSON.stringify(audienceData));

    // Track purchase with audience data
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "purchase_with_audience",
      user_type: audienceData.user_type,
      cart_value_bucket: audienceData.cart_value_bucket,
      session_count: audienceData.session_count,
      total_purchases: audienceData.total_purchases,
      purchase_value: purchaseValue,
      customer_lifetime_value: audienceData.total_purchases * purchaseValue,
      engagement_level: audienceData.engagement_level,
    });
  };

  const trackPageView = () => {
    const audienceData = getAudienceData();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view_with_audience",
      user_type: audienceData.user_type,
      cart_value_bucket: audienceData.cart_value_bucket,
      session_count: audienceData.session_count,
      engagement_level: audienceData.engagement_level,
      page_location: window.location.pathname,
    });
  };

  // Auto-track page views
  useEffect(() => {
    trackPageView();
  }, [cart.items.length]); // Re-track when cart changes

  return {
    getAudienceData,
    trackAudienceEvent,
    trackPurchase,
    trackPageView,
  };
};
