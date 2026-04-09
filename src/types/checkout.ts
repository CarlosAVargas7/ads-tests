export interface ShippingInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface PaymentInfo {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    saveCard: boolean;
}

export interface CheckoutStep {
    id: 'shipping' | 'payment' | 'confirmation';
    title: string;
    description: string;
    isCompleted: boolean;
    isActive: boolean;
}

export interface CheckoutState {
    currentStep: 'shipping' | 'payment' | 'confirmation' | 'success';
    shippingInfo: ShippingInfo;
    paymentInfo: PaymentInfo;
    steps: CheckoutStep[];
    isProcessing: boolean;
}
