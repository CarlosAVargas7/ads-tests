import { useState, useEffect } from "react";
import { CheckoutState, ShippingInfo, PaymentInfo } from "../types/checkout";
import { CartState } from "../types/cart";

const initialShippingInfo: ShippingInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "ES",
};

const initialPaymentInfo: PaymentInfo = {
  cardNumber: "",
  cardHolder: "",
  expiryDate: "",
  cvv: "",
  saveCard: false,
};

export const useCheckout = (cart: CartState) => {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    currentStep: "shipping",
    shippingInfo: initialShippingInfo,
    paymentInfo: initialPaymentInfo,
    steps: [
      {
        id: "shipping",
        title: "Envío",
        description: "Información de envío",
        isCompleted: false,
        isActive: true,
      },
      {
        id: "payment",
        title: "Pago",
        description: "Método de pago",
        isCompleted: false,
        isActive: false,
      },
      {
        id: "confirmation",
        title: "Confirmación",
        description: "Revisar pedido",
        isCompleted: false,
        isActive: false,
      },
    ],
    isProcessing: false,
  });

  // Track checkout step abandonment
  useEffect(() => {
    const handleStepChange = (step: string) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "checkout_step_view",
        checkout_step: checkoutState.steps.findIndex((s) => s.id === step) + 1,
        checkout_step_name: step,
        cart_value: cart.total,
        cart_items: cart.items.length,
        engagement_time_msec: 100,
      });
      console.log(`?? Checkout Step View: ${step}`);
    };

    handleStepChange(checkoutState.currentStep);
  }, [checkoutState.currentStep, cart.total, cart.items.length]);

  const updateShippingInfo = (info: Partial<ShippingInfo>) => {
    setCheckoutState((prev) => ({
      ...prev,
      shippingInfo: { ...prev.shippingInfo, ...info },
    }));
  };

  const updatePaymentInfo = (info: Partial<PaymentInfo>) => {
    setCheckoutState((prev) => {
      const updatedPaymentInfo = { ...prev.paymentInfo, ...info };

      // Check if payment info is complete after update
      const { cardNumber, cardHolder, expiryDate, cvv } = updatedPaymentInfo;
      const cardRegex = /^[\d\s]+$/;
      const cvvRegex = /^\d{3,4}$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

      const isPaymentComplete = !!(
        cardRegex.test(cardNumber.replace(/\s/g, "")) &&
        cardNumber.replace(/\s/g, "").length >= 13 &&
        cardHolder &&
        expiryRegex.test(expiryDate) &&
        cvvRegex.test(cvv)
      );

      // Track add_payment_info event when payment info is complete
      if (
        isPaymentComplete &&
        !(
          cardRegex.test(prev.paymentInfo.cardNumber.replace(/\s/g, "")) &&
          prev.paymentInfo.cardNumber.replace(/\s/g, "").length >= 13 &&
          prev.paymentInfo.cardHolder &&
          expiryRegex.test(prev.paymentInfo.expiryDate) &&
          cvvRegex.test(prev.paymentInfo.cvv)
        )
      ) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "add_payment_info",
          ecommerce: {
            currency: "USD",
            value: cart.total,
            items: cart.items.map((item) => ({
              item_name: item.name,
              item_id: item.id,
              price: item.price,
              item_category: item.category,
              item_variant: item.itemType,
              quantity: item.quantity,
            })),
          },
          payment_type: "credit_card",
        });

        console.log("?? Add Payment Info Event:", {
          value: cart.total,
          items_count: cart.items.length,
          payment_type: "credit_card",
        });
      }

      return {
        ...prev,
        paymentInfo: updatedPaymentInfo,
      };
    });
  };

  const validateShippingInfo = (): boolean => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
    } = checkoutState.shippingInfo;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s-()]+$/;

    return !!(
      firstName &&
      lastName &&
      emailRegex.test(email) &&
      phoneRegex.test(phone) &&
      address &&
      city &&
      state &&
      zipCode &&
      country
    );
  };

  const validatePaymentInfo = (): boolean => {
    const { cardNumber, cardHolder, expiryDate, cvv } =
      checkoutState.paymentInfo;

    const cardRegex = /^[\d\s]+$/;
    const cvvRegex = /^\d{3,4}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    return !!(
      cardRegex.test(cardNumber.replace(/\s/g, "")) &&
      cardNumber.replace(/\s/g, "").length >= 13 &&
      cardHolder &&
      expiryRegex.test(expiryDate) &&
      cvvRegex.test(cvv)
    );
  };

  const goToNextStep = () => {
    const currentStepIndex = checkoutState.steps.findIndex(
      (s) => s.id === checkoutState.currentStep,
    );

    if (currentStepIndex === checkoutState.steps.length - 1) return;

    const nextStep = checkoutState.steps[currentStepIndex + 1];

    // Track step completion
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "checkout_step_completed",
      checkout_step: currentStepIndex + 1,
      checkout_step_name: checkoutState.currentStep,
      cart_value: cart.total,
      cart_items: cart.items.length,
      engagement_time_msec: 150,
    });
    console.log(`?? Checkout Step Completed: ${checkoutState.currentStep}`);

    setCheckoutState((prev) => ({
      ...prev,
      currentStep: nextStep.id as "shipping" | "payment" | "confirmation",
      steps: prev.steps.map((step, index) => ({
        ...step,
        isCompleted: index <= currentStepIndex,
        isActive: index === currentStepIndex + 1,
      })),
    }));
  };

  const goToPreviousStep = () => {
    const currentStepIndex = checkoutState.steps.findIndex(
      (s) => s.id === checkoutState.currentStep,
    );

    if (currentStepIndex === 0) return;

    const previousStep = checkoutState.steps[currentStepIndex - 1];

    // Track step abandonment
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "checkout_step_abandonment",
      checkout_step: currentStepIndex + 1,
      checkout_step_name: checkoutState.currentStep,
      cart_value: cart.total,
      cart_items: cart.items.length,
      engagement_time_msec: 50,
    });
    console.log(`?? Checkout Step Abandonment: ${checkoutState.currentStep}`);

    setCheckoutState((prev) => ({
      ...prev,
      currentStep: previousStep.id as "shipping" | "payment" | "confirmation",
      steps: prev.steps.map((step, index) => ({
        ...step,
        isCompleted: index < currentStepIndex - 1,
        isActive: index === currentStepIndex - 1,
      })),
    }));
  };

  const goToStep = (stepId: "shipping" | "payment" | "confirmation") => {
    const stepIndex = checkoutState.steps.findIndex((s) => s.id === stepId);
    const currentStepIndex = checkoutState.steps.findIndex(
      (s) => s.id === checkoutState.currentStep,
    );

    // Only allow going to completed steps or next step
    if (stepIndex > currentStepIndex + 1) return;

    setCheckoutState((prev) => ({
      ...prev,
      currentStep: stepId,
      steps: prev.steps.map((step, index) => ({
        ...step,
        isCompleted: index < stepIndex,
        isActive: index === stepIndex,
      })),
    }));
  };

  const completeCheckout = async () => {
    setCheckoutState((prev) => ({ ...prev, isProcessing: true }));

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Purchase event is handled in CheckoutSuccess.tsx with proper UTM attribution
    console.log(
      "?? Checkout processing completed - redirecting to success page",
    );

    setCheckoutState((prev) => ({
      ...prev,
      currentStep: "success",
      isProcessing: false,
    }));
  };

  const resetCheckout = () => {
    setCheckoutState({
      currentStep: "shipping",
      shippingInfo: initialShippingInfo,
      paymentInfo: initialPaymentInfo,
      steps: [
        {
          id: "shipping",
          title: "Envío",
          description: "Información de envío",
          isCompleted: false,
          isActive: true,
        },
        {
          id: "payment",
          title: "Pago",
          description: "Método de pago",
          isCompleted: false,
          isActive: false,
        },
        {
          id: "confirmation",
          title: "Confirmación",
          description: "Revisar pedido",
          isCompleted: false,
          isActive: false,
        },
      ],
      isProcessing: false,
    });
  };

  return {
    checkoutState,
    updateShippingInfo,
    updatePaymentInfo,
    validateShippingInfo,
    validatePaymentInfo,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    completeCheckout,
    resetCheckout,
  };
};
