import { useAudienceTracking } from '../hooks/useAudienceTracking';
import { CartState } from '../types/cart';

export const AudienceTester: React.FC = () => {
    const mockCart: CartState = { items: [], isOpen: false, total: 0 };
    const { getAudienceData } = useAudienceTracking(mockCart);
    const audienceData = getAudienceData();


    const simulateEngagedUser = () => {
        const currentData = getAudienceData();
        if (currentData) {
            currentData.session_count = 5;
            currentData.total_page_views = 15;
            currentData.time_on_site = 8;
            currentData.product_views_count = 7;
            currentData.form_interactions = 2;
            currentData.button_clicks = 5;
            currentData.scroll_depth = 75;
            currentData.visited_pages = ['/home', '/tienda', '/checkout', '/about'];
            localStorage.setItem('audience_data', JSON.stringify(currentData));
            window.location.reload();
        }
    };

    const simulateHighValueUser = () => {
        const currentData = getAudienceData();
        if (currentData) {
            currentData.total_purchases = 4;
            currentData.average_order_value = 350;
            currentData.customer_lifetime_value = 1400;
            currentData.purchase_frequency = 'repeat';
            currentData.session_count = 12;
            currentData.total_cart_value = 2800;
            currentData.cart_add_count = 8;
            localStorage.setItem('audience_data', JSON.stringify(currentData));
            window.location.reload();
        }
    };

    const simulatePageViews = (count: number) => {
        const currentData = getAudienceData();
        if (currentData) {
            currentData.total_page_views = count;
            currentData.visited_pages = Array.from({ length: Math.min(count, 5) }, (_, i) => `/page${i + 1}`);
            localStorage.setItem('audience_data', JSON.stringify(currentData));
            window.location.reload();
        }
    };

    const simulateProductInteractions = (count: number) => {
        const currentData = getAudienceData();
        if (currentData) {
            currentData.product_views_count = count;
            currentData.products_viewed = ['product-a', 'product-b', 'product-c'].slice(0, count);
            currentData.categories_viewed = ['Servicios', 'Productos'];
            localStorage.setItem('audience_data', JSON.stringify(currentData));
            window.location.reload();
        }
    };

    const resetAudience = () => {
        localStorage.removeItem('audience_data');
        window.location.reload();
    };

    const getAudienceColor = (type: string) => {
        switch (type) {
            case 'high_value_user': return 'text-purple-400';
            case 'engaged_user': return 'text-blue-400';
            case 'buyer': return 'text-green-400';
            case 'returning': return 'text-yellow-400';
            case 'new': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    const getBucketColor = (bucket: string) => {
        switch (bucket) {
            case 'high': return 'text-green-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-orange-400';
            case 'none': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    const getEngagementColor = (level: string) => {
        switch (level) {
            case 'high': return 'text-green-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    if (!audienceData) {
        return null;
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 w-80 h-96 overflow-y-auto flex flex-col">
            <h3 className="text-white font-semibold mb-3 text-sm">Advanced Audience Segments</h3>

            {/* Core User Classification */}
            <div className="space-y-2 mb-3 text-xs">
                <div className="flex justify-between">
                    <span className="text-gray-400">User Type:</span>
                    <span className={getAudienceColor(audienceData.user_type)}>
                        {audienceData.user_type.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Cart Value:</span>
                    <span className={getBucketColor(audienceData.cart_value_bucket)}>
                        {audienceData.cart_value_bucket.toUpperCase()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Engagement:</span>
                    <span className={getEngagementColor(audienceData.engagement_level)}>
                        {audienceData.engagement_level.toUpperCase()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Active User:</span>
                    <span className={audienceData.is_active_user ? 'text-green-400' : 'text-gray-400'}>
                        {audienceData.is_active_user ? 'YES' : 'NO'}
                    </span>
                </div>
            </div>

            {/* Behavioral Metrics */}
            <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
                <div className="text-gray-400 font-medium mb-1">Behavioral Metrics:</div>
                <div className="grid grid-cols-2 gap-1">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Sessions:</span>
                        <span className="text-white">{audienceData.session_count}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Page Views:</span>
                        <span className="text-white">{audienceData.total_page_views}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Time on Site:</span>
                        <span className="text-white">{audienceData.time_on_site}m</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Product Views:</span>
                        <span className="text-white">{audienceData.product_views_count}</span>
                    </div>
                </div>
            </div>

            {/* Purchase Metrics */}
            {audienceData.total_purchases > 0 && (
                <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
                    <div className="text-gray-400 font-medium mb-1">Purchase Metrics:</div>
                    <div className="grid grid-cols-2 gap-1">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Purchases:</span>
                            <span className="text-white">{audienceData.total_purchases}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">AOV:</span>
                            <span className="text-white">${audienceData.average_order_value}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">LTV:</span>
                            <span className="text-white">${audienceData.customer_lifetime_value}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Frequency:</span>
                            <span className="text-white">{audienceData.purchase_frequency}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Simulation Controls */}
            <div className="space-y-2 mb-3">
                <div className="text-gray-400 text-xs mb-1">Advanced Simulations:</div>
                <div className="grid grid-cols-2 gap-1">
                    <button
                        onClick={simulateEngagedUser}
                        className="bg-blue-600 text-white text-xs px-1 py-1 rounded hover:bg-blue-700"
                    >
                        Engaged User
                    </button>
                    <button
                        onClick={simulateHighValueUser}
                        className="bg-purple-600 text-white text-xs px-1 py-1 rounded hover:bg-purple-700"
                    >
                        High Value
                    </button>
                </div>
                <div className="text-gray-400 text-xs mt-1">Page Views:</div>
                <div className="grid grid-cols-3 gap-1">
                    <button
                        onClick={() => simulatePageViews(3)}
                        className="bg-gray-700 text-gray-300 text-xs px-1 py-1 rounded hover:bg-gray-600"
                    >
                        3
                    </button>
                    <button
                        onClick={() => simulatePageViews(10)}
                        className="bg-gray-700 text-gray-300 text-xs px-1 py-1 rounded hover:bg-gray-600"
                    >
                        10
                    </button>
                    <button
                        onClick={() => simulatePageViews(25)}
                        className="bg-gray-700 text-gray-300 text-xs px-1 py-1 rounded hover:bg-gray-600"
                    >
                        25
                    </button>
                </div>
                <div className="text-gray-400 text-xs mt-1">Product Views:</div>
                <div className="grid grid-cols-3 gap-1">
                    <button
                        onClick={() => simulateProductInteractions(2)}
                        className="bg-gray-700 text-gray-300 text-xs px-1 py-1 rounded hover:bg-gray-600"
                    >
                        2
                    </button>
                    <button
                        onClick={() => simulateProductInteractions(5)}
                        className="bg-gray-700 text-gray-300 text-xs px-1 py-1 rounded hover:bg-gray-600"
                    >
                        5
                    </button>
                    <button
                        onClick={() => simulateProductInteractions(10)}
                        className="bg-gray-700 text-gray-300 text-xs px-1 py-1 rounded hover:bg-gray-600"
                    >
                        10
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={resetAudience}
                    className="flex-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                >
                    Reset All
                </button>
            </div>

            {/* GA4 & Google Ads Integration Insights */}
            <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="text-gray-400 text-xs mb-2">GA4 & Ads Integration:</div>
                <div className="space-y-1 text-xs">
                    <div className="text-gray-300">
                        GA4 Audience: {audienceData.user_type.replace('_', '_').toUpperCase()}
                    </div>
                    <div className="text-gray-300">
                        Remarketing: {audienceData.engagement_level === 'high' ? 'Include' : 'Exclude'}
                    </div>
                    <div className="text-gray-300">
                        Bid Adjust: {audienceData.user_type === 'high_value_user' ? '+50%' :
                            audienceData.user_type === 'engaged_user' ? '+25%' :
                                audienceData.user_type === 'buyer' ? '+15%' : 'Standard'}
                    </div>
                    <div className="text-gray-300">
                        Frequency: {audienceData.is_active_user ? 'Normal' : 'Increase'}
                    </div>
                </div>
            </div>
        </div>
    );
};
