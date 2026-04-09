export interface CartItem {
    id: string;
    name: string;
    price: number;
    category: 'Servicios' | 'Productos';
    quantity: number;
    itemType: 'service' | 'product';
}

export interface CartState {
    items: CartItem[];
    isOpen: boolean;
    total: number;
}
