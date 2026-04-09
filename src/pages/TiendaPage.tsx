import { Product } from '../types';
import { CartItem } from '../types/cart';
import { SEO } from '../components/SEO';
import { CampaignDisplay } from '../components/CampaignDisplay';
import { ProductCard } from '../components/ProductCard';
import { useAnalytics } from '../hooks/useAnalytics';
import { useErrorTracking } from '../hooks/useErrorTracking';
import { useCampaignTracking } from '../hooks/useCampaignTracking';
import { useUserManagement } from '../hooks/useUserManagement';
import { useCartContext } from '../contexts/CartContext';

export const TiendaPage: React.FC = () => {
    useAnalytics();
    useErrorTracking();
    const utmData = useCampaignTracking();
    const { addToCart } = useCartContext();
    const { } = useUserManagement();

    // Servicios
    const services: Product[] = [
        { id: 'serv-a', name: 'Consultoría SEO', price: 299.99, category: 'Servicios', description: 'Optimización completa para motores de búsqueda' },
        { id: 'serv-b', name: 'Marketing Digital', price: 399.99, category: 'Servicios', description: 'Estrategias integrales de marketing online' },
        { id: 'serv-c', name: 'Analytics Avanzado', price: 199.99, category: 'Servicios', description: 'Análisis profundo de datos y métricas' }
    ];

    // Productos
    const products: Product[] = [
        { id: 'prod-d', name: 'Ebook SEO 2024', price: 49.99, category: 'Productos', description: 'Guía completa de SEO actualizada' },
        { id: 'prod-e', name: 'Plantillas GA4', price: 79.99, category: 'Productos', description: 'Set de plantillas para Google Analytics 4' },
        { id: 'prod-f', name: 'Curso Ads Mastery', price: 149.99, category: 'Productos', description: 'Curso completo de Google Ads' }
    ];

    const handleViewItem = (item: Product, itemType: 'service' | 'product'): void => {
        window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
                items: [{
                    item_name: item.name,
                    item_id: item.id,
                    price: item.price,
                    item_category: item.category,
                    item_variant: itemType
                }]
            },
            engagement_time_msec: 150
        });
        console.log(`?? View Item: ${item.name}`);
    };

    const handleAddToCart = (item: Product, itemType: 'service' | 'product'): void => {
        const cartItem: CartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
            quantity: 1,
            itemType
        };
        addToCart(cartItem);
    };

    const handleSelectItem = (item: Product, itemType: 'service' | 'product'): void => {
        window.dataLayer.push({
            event: 'select_item',
            ecommerce: {
                items: [{
                    item_name: item.name,
                    item_id: item.id,
                    price: item.price,
                    item_category: item.category,
                    item_variant: itemType
                }]
            },
            engagement_time_msec: 80
        });
        console.log(`? Select Item: ${item.name}`);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <SEO title="Tienda | Tracking Lab" desc="Catálogo de servicios y productos con tracking avanzado" />

            <CampaignDisplay utmData={utmData} />

            {/* Hero Section Tienda */}
            <section className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-16 px-6 text-center">
                <h1 className="text-4xl font-extrabold mb-4">Nuestra Tienda</h1>
                <p className="text-lg max-w-2xl mx-auto opacity-90">
                    Servicios profesionales y productos digitales para potenciar tu marketing
                </p>
            </section>

            {/* Servicios Section */}
            <section className="max-w-6xl mx-auto py-12 px-6">
                <h2 className="text-3xl font-bold mb-8 text-gray-100">Servicios Profesionales</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <ProductCard
                            key={service.id}
                            product={service}
                            itemType="service"
                            onSelectItem={handleSelectItem}
                            onViewItem={handleViewItem}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </section>

            {/* Productos Section */}
            <section className="max-w-6xl mx-auto py-12 px-6">
                <h2 className="text-3xl font-bold mb-8 text-gray-100">Productos Digitales</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            itemType="product"
                            onSelectItem={handleSelectItem}
                            onViewItem={handleViewItem}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};
