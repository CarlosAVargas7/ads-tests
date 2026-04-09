import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { CampaignDisplay } from '../components/CampaignDisplay';
import { ProductCard } from '../components/ProductCard';
import { useAnalytics } from '../hooks/useAnalytics';
import { useErrorTracking } from '../hooks/useErrorTracking';
import { useCampaignTracking } from '../hooks/useCampaignTracking';
import { useUserManagement } from '../hooks/useUserManagement';
import { useCartContext } from '../contexts/CartContext';

export const HomePage: React.FC = () => {
    useAnalytics();
    useErrorTracking();
    const utmData = useCampaignTracking();
    const navigate = useNavigate();
    const { } = useUserManagement();
    const { addToCart } = useCartContext();

    const triggeredScrolls = useRef(new Set<number>());

    // Services and Products data (same as TiendaPage)
    const services = [
        { id: 'serv-a', name: 'Consultoría SEO', price: 299.99, category: 'Servicios' as const, description: 'Optimización completa para motores de búsqueda' },
        { id: 'serv-b', name: 'Marketing Digital', price: 399.99, category: 'Servicios' as const, description: 'Estrategias integrales de marketing online' },
        { id: 'serv-c', name: 'Analytics Avanzado', price: 199.99, category: 'Servicios' as const, description: 'Análisis profundo de datos y métricas' }
    ];

    const products = [
        { id: 'prod-d', name: 'Ebook SEO 2024', price: 49.99, category: 'Productos' as const, description: 'Guía completa de SEO actualizada' },
        { id: 'prod-e', name: 'Plantillas GA4', price: 79.99, category: 'Productos' as const, description: 'Set de plantillas para Google Analytics 4' },
        { id: 'prod-f', name: 'Curso Ads Mastery', price: 149.99, category: 'Productos' as const, description: 'Curso completo de Google Ads' }
    ];

    useEffect(() => {
        const handleScroll = (): void => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = Math.round((winScroll / height) * 100);

            [25, 50, 75, 100].forEach(threshold => {
                if (scrolled >= threshold && !triggeredScrolls.current.has(threshold)) {
                    triggeredScrolls.current.add(threshold);
                    window.dataLayer.push({
                        event: 'scroll_depth',
                        percent: threshold,
                        engagement_time_msec: 50
                    });
                    console.log(`? Scroll Único: ${threshold}%`);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCTA = (id: string, section: string): void => {
        window.dataLayer.push({
            event: 'cta_click',
            button_id: id,
            page: window.location.pathname,
            section: section,
            value: 1,
            engagement_time_msec: 100
        });
        console.log(`? Evento enviado: ${id} en sección ${section}`);
    };

    const handleViewItem = (): void => {
        window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
                items: [{
                    item_name: 'Consultoría Ads Premium',
                    item_id: 'SRV-001',
                    price: 150.00,
                    item_category: 'Servicios'
                }]
            },
            engagement_time_msec: 150
        });
        console.log('?? Evento Ecommerce: view_item');
    };

    const handleServiceProductView = (item: any, itemType: 'service' | 'product'): void => {
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

    const handleServiceProductAdd = (item: any, itemType: 'service' | 'product'): void => {
        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
            quantity: 1,
            itemType
        };
        addToCart(cartItem);
    };

    const handleServiceProductSelect = (item: any, itemType: 'service' | 'product'): void => {
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
        <div className="min-h-[200vh] bg-gray-900">
            <SEO title="Inicio | Ads Tracking Sandbox" desc="Laboratorio de pruebas técnicas para Google Ads y GA4" />

            <section className="bg-indigo-600 text-white h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
                <h1 className="text-6xl md:text-7xl font-extrabold mb-8">Ads & Tracking Sandbox</h1>
                <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90 mb-12">
                    Usa esta página para capturar eventos de Google Ads. Baja para probar el scroll o haz clic en los CTAs.
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                    <button
                        onClick={() => handleCTA('main_hero_btn', 'hero')}
                        className="bg-gray-800 text-indigo-300 font-bold px-10 py-4 rounded-lg hover:shadow-xl hover:bg-gray-700 transition-all text-lg"
                    >
                        Botón de Conversión A
                    </button>
                    <button
                        onClick={handleViewItem}
                        className="bg-indigo-500 text-white border border-indigo-400 font-bold px-10 py-4 rounded-lg hover:bg-indigo-400 transition-all text-lg"
                    >
                        Ver Servicio (view_item)
                    </button>
                </div>
            </section>

            {/* Services Section */}
            <section className="bg-gray-900 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-4">Nuestros Servicios Profesionales</h2>
                    <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                        Soluciones integrales para potenciar tu presencia digital y alcanzar tus objetivos de negocio
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <ProductCard
                                key={service.id}
                                product={service}
                                itemType="service"
                                onSelectItem={handleServiceProductSelect}
                                onViewItem={handleServiceProductView}
                                onAddToCart={handleServiceProductAdd}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="bg-gray-900 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-4">Productos Digitales</h2>
                    <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                        Recursos y herramientas digitales para implementar tus estrategias de marketing
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                itemType="product"
                                onSelectItem={handleServiceProductSelect}
                                onViewItem={handleServiceProductView}
                                onAddToCart={handleServiceProductAdd}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <CampaignDisplay utmData={utmData} />

            <main className="max-w-4xl mx-auto py-20 px-6">
                <h2 className="text-3xl font-bold mb-10 text-gray-100">Pruebas de Interacción</h2>

                <div className="space-y-20">
                    <div className="p-10 bg-gray-800 border border-gray-700 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-100">Módulo de Captación (Lead Gen)</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                window.dataLayer.push({
                                    event: 'generate_lead',
                                    form_id: 'lead_form_01',
                                    value: 50,
                                    currency: 'USD',
                                    engagement_time_msec: 200
                                });
                                navigate('/success');
                            }}
                            className="grid gap-4"
                        >
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                required
                                className="p-3 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button className="bg-emerald-600 text-white font-bold py-3 rounded-md hover:bg-emerald-700">
                                Enviar Formulario (Lead)
                            </button>
                        </form>
                    </div>

                    <button
                        id="secondary-conversion"
                        onClick={() => handleCTA('footer_secondary_btn', 'footer')}
                        className="w-full py-4 border-2 border-indigo-400 text-indigo-400 font-bold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Botón Secundario (Click Tracking)
                    </button>
                </div>
            </main>
        </div>
    );
};
