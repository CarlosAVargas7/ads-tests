import { useEffect } from "react";

export interface UserAcquisitionData {
  user_id: string;
  first_touch: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
    timestamp: number;
    landing_page: string;
  };
  last_touch: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
    timestamp: number;
    landing_page: string;
  };
  user_acquisition_source: string;
  total_sessions: number;
  total_page_views: number;
  first_visit: number;
  last_visit: number;
}

export const useUserAcquisitionTracking = (): {
  getUserAcquisitionData: () => UserAcquisitionData | null;
  injectUserData: (eventData: any) => any;
  setUserAcquisitionData: () => void;
} => {
  const generateUserId = (): string => {
    // Generate or retrieve user ID
    let userId = localStorage.getItem("user_id");
    if (!userId) {
      userId =
        "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("user_id", userId);
    }
    return userId;
  };

  const captureUTMParameters = (): any => {
    const urlParams = new URLSearchParams(window.location.search);

    const utmData = {
      utm_source: urlParams.get("utm_source") || "direct",
      utm_medium: urlParams.get("utm_medium") || "none",
      utm_campaign: urlParams.get("utm_campaign") || "no_campaign",
      utm_term: urlParams.get("utm_term") || undefined,
      utm_content: urlParams.get("utm_content") || undefined,
      timestamp: Date.now(),
      landing_page: window.location.pathname + window.location.search,
    };

    // Only consider it a real UTM if we have actual parameters
    const hasValidUTM =
      urlParams.get("utm_source") ||
      urlParams.get("utm_campaign") ||
      urlParams.get("utm_medium");

    return hasValidUTM
      ? utmData
      : {
          utm_source: "direct",
          utm_medium: "none",
          utm_campaign: "no_campaign",
          timestamp: Date.now(),
          landing_page: window.location.pathname + window.location.search,
        };
  };

  const setUserAcquisitionData = (): void => {
    const userId = generateUserId();
    const currentUTM = captureUTMParameters();

    try {
      // Get existing user data
      let userData: UserAcquisitionData = {
        user_id: userId,
        first_touch: {
          source: "direct",
          medium: "none",
          campaign: "no_campaign",
          timestamp: Date.now(),
          landing_page: window.location.pathname,
        },
        last_touch: {
          source: "direct",
          medium: "none",
          campaign: "no_campaign",
          timestamp: Date.now(),
          landing_page: window.location.pathname,
        },
        user_acquisition_source: "direct",
        total_sessions: 1,
        total_page_views: 1,
        first_visit: Date.now(),
        last_visit: Date.now(),
      };

      const stored = localStorage.getItem("user_acquisition_data");
      if (stored) {
        userData = JSON.parse(stored);
        userData.last_touch = currentUTM;
        userData.last_visit = Date.now();
        userData.total_sessions += 1;
        userData.total_page_views += 1;
      } else {
        // First time user - set first touch
        userData.first_touch = currentUTM;
        userData.last_touch = currentUTM;
        userData.user_acquisition_source = currentUTM.source;
        userData.first_visit = Date.now();
        userData.last_visit = Date.now();
      }

      // Save updated data
      localStorage.setItem("user_acquisition_data", JSON.stringify(userData));

      // Set user data in dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "set_user_data",
        user_id: userData.user_id,
        traffic_source: userData.first_touch.source,
        campaign: userData.first_touch.campaign,
        medium: userData.first_touch.medium,
        first_touch_timestamp: userData.first_touch.timestamp,
        last_touch_timestamp: userData.last_touch.timestamp,
        total_sessions: userData.total_sessions,
        user_acquisition_source: userData.user_acquisition_source,
        user_type: userData.total_sessions === 1 ? "new" : "returning",
      });

      console.log("?? User Acquisition Data Set:", {
        user_id: userData.user_id,
        acquisition_source: userData.user_acquisition_source,
        sessions: userData.total_sessions,
        first_source: userData.first_touch.source,
        last_source: userData.last_touch.source,
      });
    } catch (error) {
      console.error("?? Error setting user acquisition data:", error);
    }
  };

  const trackPageView = (): void => {
    const userData = getUserAcquisitionData();
    if (userData) {
      userData.total_page_views += 1;
      userData.last_visit = Date.now();
      localStorage.setItem("user_acquisition_data", JSON.stringify(userData));

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view_with_user_data",
        user_id: userData.user_id,
        traffic_source: userData.last_touch.source,
        campaign: userData.last_touch.campaign,
        medium: userData.last_touch.medium,
        total_sessions: userData.total_sessions,
        total_page_views: userData.total_page_views,
        user_acquisition_source: userData.user_acquisition_source,
        page_location: window.location.pathname,
      });
    }
  };

  const getUserAcquisitionData = (): UserAcquisitionData | null => {
    try {
      const stored = localStorage.getItem("user_acquisition_data");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("?? Error reading user acquisition data:", error);
      return null;
    }
  };

  const injectUserData = (eventData: any): any => {
    const userData = getUserAcquisitionData();
    if (userData) {
      return {
        ...eventData,
        user_id: userData.user_id,
        traffic_source: userData.last_touch.source,
        campaign: userData.last_touch.campaign,
        medium: userData.last_touch.medium,
        first_touch_source: userData.first_touch.source,
        first_touch_campaign: userData.first_touch.campaign,
        user_acquisition_source: userData.user_acquisition_source,
        total_sessions: userData.total_sessions,
        user_type: userData.total_sessions === 1 ? "new" : "returning",
      };
    }
    return eventData;
  };

  // Auto-capture on hook initialization
  useEffect(() => {
    setUserAcquisitionData();
  }, []);

  // Track page views
  useEffect(() => {
    const handlePageView = () => {
      trackPageView();
    };

    // Track initial page view
    handlePageView();

    // Track spa navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      setTimeout(handlePageView, 0);
    };

    return () => {
      window.history.pushState = originalPushState;
    };
  }, []);

  return {
    getUserAcquisitionData,
    injectUserData,
    setUserAcquisitionData,
  };
};
