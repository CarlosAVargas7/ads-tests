import { useEffect } from "react";

export interface CheckoutErrorData {
  checkout_step: "shipping" | "payment" | "confirmation";
  error_type: "validation" | "payment" | "shipping" | "technical";
  error_message: string;
  field_name?: string;
  cart_value: number;
  cart_items_count: number;
  user_agent: string;
  timestamp: string;
}

export const useErrorTracking = (): ((
  errorData: CheckoutErrorData,
) => void) => {
  useEffect(() => {
    const handleError = (e: ErrorEvent): void => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "js_error",
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error_object: e.error?.toString(),
        page_path: window.location.pathname,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        engagement_time_msec: 0,
      });
      console.error("?? Error tracked:", e.message);
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent): void => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "unhandled_promise_rejection",
        message: e.reason?.toString() || "Unknown promise rejection",
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
        engagement_time_msec: 0,
      });
      console.error("?? Promise rejection tracked:", e.reason);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  const trackCheckoutError = (errorData: CheckoutErrorData): void => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "checkout_error",
      checkout_step: errorData.checkout_step,
      error_type: errorData.error_type,
      error_message: errorData.error_message,
      field_name: errorData.field_name,
      cart_value: errorData.cart_value,
      cart_items_count: errorData.cart_items_count,
      user_agent: errorData.user_agent,
      timestamp: errorData.timestamp,
      page_path: "/checkout",
    });

    console.error("?? Checkout Error:", {
      step: errorData.checkout_step,
      type: errorData.error_type,
      message: errorData.error_message,
      cart_value: errorData.cart_value,
    });
  };

  return trackCheckoutError;
};
