import { useEffect } from "react";

export interface UTMData {
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  timestamp: number;
}

export const useUTMTracking = () => {
  const captureUTMParameters = (): UTMData => {
    const urlParams = new URLSearchParams(window.location.search);

    const utmData: UTMData = {
      utm_source: urlParams.get("utm_source") || undefined,
      utm_campaign: urlParams.get("utm_campaign") || undefined,
      utm_medium: urlParams.get("utm_medium") || undefined,
      utm_term: urlParams.get("utm_term") || undefined,
      utm_content: urlParams.get("utm_content") || undefined,
      timestamp: Date.now(),
    };

    // Only save if we have UTM parameters
    if (utmData.utm_source || utmData.utm_campaign || utmData.utm_medium) {
      try {
        localStorage.setItem("utm_data", JSON.stringify(utmData));

        // Track UTM capture event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "utm_captured",
          utm_source: utmData.utm_source,
          utm_campaign: utmData.utm_campaign,
          utm_medium: utmData.utm_medium,
          utm_term: utmData.utm_term,
          utm_content: utmData.utm_content,
          timestamp: utmData.timestamp,
        });

        console.log("?? UTM Parameters Captured:", utmData);
      } catch (error) {
        console.error("?? Error saving UTM data to localStorage:", error);
      }
    }

    return utmData;
  };

  const getStoredUTMData = (): UTMData | null => {
    try {
      const stored = localStorage.getItem("utm_data");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("?? Error reading UTM data from localStorage:", error);
      return null;
    }
  };

  const clearUTMData = (): void => {
    try {
      localStorage.removeItem("utm_data");
      console.log("?? UTM data cleared from localStorage");
    } catch (error) {
      console.error("?? Error clearing UTM data:", error);
    }
  };

  const injectUTMData = (eventData: any): any => {
    const utmData = getStoredUTMData();
    if (utmData) {
      return {
        ...eventData,
        utm_source: utmData.utm_source,
        utm_campaign: utmData.utm_campaign,
        utm_medium: utmData.utm_medium,
        utm_term: utmData.utm_term,
        utm_content: utmData.utm_content,
        utm_timestamp: utmData.timestamp,
      };
    }
    return eventData;
  };

  // Auto-capture UTM parameters on hook initialization
  useEffect(() => {
    captureUTMParameters();
  }, []);

  return {
    captureUTMParameters,
    getStoredUTMData,
    clearUTMData,
    injectUTMData,
  };
};
