import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    itemType: 'service' | 'product';
    onSelectItem: (item: Product, itemType: 'service' | 'product') => void;
    onViewItem: (item: Product, itemType: 'service' | 'product') => void;
    onAddToCart: (item: Product, itemType: 'service' | 'product') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    itemType, 
    onSelectItem, 
    onViewItem, 
    onAddToCart 
}) => {
    const isService = itemType === 'service';
    const iconColor = isService ? 'text-indigo-400' : 'text-purple-400';
    const borderColor = isService ? 'hover:border-indigo-500' : 'hover:border-purple-500';
    const buttonColor = isService ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700';
    const icon = isService ? '??' : '??';

    return (
        <div
            className={`bg-gray-800 border border-gray-700 rounded-xl p-6 ${borderColor} transition-all cursor-pointer`}
            onClick={() => onSelectItem(product, itemType)}
        >
            <div className={`${iconColor} text-2xl mb-4`}>{icon}</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{product.description}</p>
            <div className={`text-2xl font-bold ${iconColor} mb-4`}>${product.price}</div>
            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewItem(product, itemType);
                    }}
                    className={`flex-1 ${buttonColor} text-white py-2 rounded-lg transition-colors text-sm`}
                >
                    Ver Detalles
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, itemType);
                    }}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                    Añadir
                </button>
            </div>
        </div>
    );
};
