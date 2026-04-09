import { Link } from 'react-router-dom';

interface NavigationProps {
    itemCount: number;
    onToggleCart: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ itemCount, onToggleCart }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700 p-4 flex justify-between items-center">
            <span className="font-black text-indigo-400 tracking-tighter text-xl">TRACKLAB.</span>
            <div className="flex items-center space-x-6">
                <div className="space-x-6 text-sm font-medium text-gray-400">
                    <Link to="/" className="hover:text-indigo-400 transition-colors">Inicio</Link>
                    <Link to="/tienda" className="hover:text-indigo-400 transition-colors">Tienda</Link>
                </div>

                {/* Cart Button */}
                <button
                    onClick={onToggleCart}
                    className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
};
