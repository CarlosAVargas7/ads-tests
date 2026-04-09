export interface UserData {
    user_type: 'tester' | 'lead' | 'customer';
    plan: 'free' | 'basic' | 'premium';
    engagement_level: 'low' | 'medium' | 'high';
    last_activity: string;
}

export interface UserManagement extends UserData {
    updateUserType: (newType: UserData['user_type']) => void;
    updateEngagement: (level: UserData['engagement_level']) => void;
}

export interface UTMData {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: 'Servicios' | 'Productos';
    description: string;
}

declare global {
    interface Window {
        dataLayer: any[];
    }
}
