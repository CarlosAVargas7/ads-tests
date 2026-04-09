import { useAttributionModel } from '../hooks/useAttributionModel';

export const AttributionModelTester: React.FC = () => {
    const { getAttributionData, trackTouch, getAttributionModels, getAttributionInsights, clearAttributionData } = useAttributionModel();
    const attributionData = getAttributionData();
    const models = getAttributionModels();
    const insights = getAttributionInsights();

    const simulateNewUser = () => {
        clearAttributionData();
        window.location.href = '/?utm_source=facebook&utm_campaign=awareness&utm_medium=social&utm_term=brand&utm_content=video_ad';
    };

    const simulateMultiTouchJourney = () => {
        clearAttributionData();

        // Simulate first touch
        trackTouch({
            utm_source: 'google',
            utm_campaign: 'search_ads',
            utm_medium: 'cpc',
            utm_term: 'seo_services',
            utm_content: 'text_ad'
        });

        // Simulate second touch (after delay)
        setTimeout(() => {
            trackTouch({
                utm_source: 'facebook',
                utm_campaign: 'retargeting',
                utm_medium: 'social',
                utm_content: 'carousel_ad'
            });
        }, 1000);

        // Simulate third touch (after delay)
        setTimeout(() => {
            trackTouch({
                utm_source: 'email',
                utm_campaign: 'newsletter',
                utm_medium: 'email',
                utm_content: 'promotion'
            });
        }, 2000);

        // Simulate final touch (after delay)
        setTimeout(() => {
            trackTouch({
                utm_source: 'direct',
                utm_campaign: 'no_campaign',
                utm_medium: 'none'
            });
        }, 3000);
    };

    const simulateReturningUser = () => {
        trackTouch({
            utm_source: 'google',
            utm_campaign: 'branded_search',
            utm_medium: 'cpc',
            utm_term: 'brand_name'
        });
    };

    const getSourceColor = (source: string) => {
        switch (source) {
            case 'google': return 'text-blue-400';
            case 'facebook': return 'text-indigo-400';
            case 'instagram': return 'text-pink-400';
            case 'email': return 'text-green-400';
            case 'direct': return 'text-gray-400';
            default: return 'text-yellow-400';
        }
    };

    const getComplexityColor = (complexity: string) => {
        switch (complexity) {
            case 'simple': return 'text-green-400';
            case 'low_complexity': return 'text-blue-400';
            case 'medium_complexity': return 'text-yellow-400';
            case 'high_complexity': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    if (!attributionData) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 w-80 h-96 overflow-y-auto flex flex-col">
                <h3 className="text-white font-semibold mb-3 text-sm">Attribution Model - GOD Level</h3>

                <div className="space-y-2 mb-3 text-xs">
                    <div className="text-gray-400">No attribution data yet</div>
                    <div className="text-gray-500">Simulate user journeys to see attribution models</div>
                </div>

                <div className="space-y-2 mb-3">
                    <div className="text-gray-400 text-xs mb-1">Simulate User Journeys:</div>
                    <div className="grid grid-cols-1 gap-1">
                        <button
                            onClick={simulateNewUser}
                            className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
                        >
                            New User (Facebook)
                        </button>
                        <button
                            onClick={simulateMultiTouchJourney}
                            className="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700"
                        >
                            Multi-Touch Journey
                        </button>
                        <button
                            onClick={simulateReturningUser}
                            className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700"
                        >
                            Returning User
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={clearAttributionData}
                        className="flex-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 w-80 h-96 overflow-y-auto flex flex-col">
            <h3 className="text-white font-semibold mb-3 text-sm">Attribution Model - GOD Level</h3>

            {/* User Journey Summary */}
            <div className="space-y-2 mb-3 text-xs">
                <div className="flex justify-between">
                    <span className="text-gray-400">User ID:</span>
                    <span className="text-white font-mono">
                        {attributionData.user_id.substring(0, 12)}...
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Total Touches:</span>
                    <span className="text-white">{attributionData.total_touches}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Journey Complexity:</span>
                    <span className={getComplexityColor(insights?.user_journey.complexity || 'simple')}>
                        {(insights?.user_journey.complexity || 'simple').replace('_', ' ').toUpperCase()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Multi-Touch:</span>
                    <span className={attributionData.is_multi_touch ? 'text-green-400' : 'text-gray-400'}>
                        {attributionData.is_multi_touch ? 'YES' : 'NO'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Journey Days:</span>
                    <span className="text-white">{attributionData.days_since_first_touch}</span>
                </div>
            </div>

            {/* First vs Last Touch */}
            <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
                <div className="text-gray-400 font-medium mb-1">First vs Last Touch:</div>
                <div className="grid grid-cols-1 gap-1">
                    <div className="flex justify-between">
                        <span className="text-gray-400">First:</span>
                        <span className={getSourceColor(attributionData.first_touch.source)}>
                            {attributionData.first_touch.source}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">First Campaign:</span>
                        <span className="text-white text-xs truncate max-w-[100px]">
                            {attributionData.first_touch.campaign}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Last:</span>
                        <span className={getSourceColor(attributionData.last_touch.source)}>
                            {attributionData.last_touch.source}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Last Campaign:</span>
                        <span className="text-white text-xs truncate max-w-[100px]">
                            {attributionData.last_touch.campaign}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Source Changed:</span>
                        <span className={insights?.attribution_summary.source_changed ? 'text-yellow-400' : 'text-green-400'}>
                            {insights?.attribution_summary.source_changed ? 'YES' : 'NO'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Attribution Models */}
            {models && (
                <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
                    <div className="text-gray-400 font-medium mb-1">Attribution Models:</div>

                    <div className="space-y-2">
                        <div>
                            <div className="text-gray-300">First Touch ({(models.first_touch.confidence * 100).toFixed(0)}% confidence):</div>
                            <div className="flex justify-between">
                                <span className={getSourceColor(models.first_touch.source)}>
                                    {models.first_touch.source}
                                </span>
                                <span className="text-white">{models.first_touch.campaign}</span>
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-300">Last Touch ({(models.last_touch.confidence * 100).toFixed(0)}% confidence):</div>
                            <div className="flex justify-between">
                                <span className={getSourceColor(models.last_touch.source)}>
                                    {models.last_touch.source}
                                </span>
                                <span className="text-white">{models.last_touch.campaign}</span>
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-300">Linear ({models.linear.sources.length} sources):</div>
                            {models.linear.sources.slice(0, 2).map((source: any, index: number) => (
                                <div key={index} className="flex justify-between">
                                    <span className={getSourceColor(source.source)}>
                                        {source.source}
                                    </span>
                                    <span className="text-white">{source.credit.toFixed(1)}%</span>
                                </div>
                            ))}
                            {models.linear.sources.length > 2 && (
                                <div className="text-gray-500">+{models.linear.sources.length - 2} more</div>
                            )}
                        </div>

                        <div>
                            <div className="text-gray-300">Time Decay:</div>
                            {models.time_decay.sources.slice(0, 2).map((source: any, index: number) => (
                                <div key={index} className="flex justify-between">
                                    <span className={getSourceColor(source.source)}>
                                        {source.source}
                                    </span>
                                    <span className="text-white">{source.credit.toFixed(1)}%</span>
                                </div>
                            ))}
                            {models.time_decay.sources.length > 2 && (
                                <div className="text-gray-500">+{models.time_decay.sources.length - 2} more</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Touch History */}
            <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
                <div className="text-gray-400 font-medium mb-1">Touch History:</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                    {attributionData.touch_history.slice(-3).reverse().map((touch: any, index: number) => (
                        <div key={index} className="flex justify-between">
                            <span className={getSourceColor(touch.source)}>
                                {touch.source}
                            </span>
                            <span className="text-gray-400 text-xs">
                                Session {touch.session_number}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            {insights && (
                <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
                    <div className="text-gray-400 font-medium mb-1">AI Recommendations:</div>
                    <div className="space-y-1">
                        <div className="text-gray-300">
                            Primary: {insights.recommendations.primary_attribution.replace('_', ' ')}
                        </div>
                        <div className="text-gray-300">
                            Secondary: {insights.recommendations.secondary_attribution.replace('_', ' ')}
                        </div>
                        <div className="text-gray-300">
                            Focus: {insights.recommendations.optimization_focus.replace('_', ' ')}
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-2 mb-3">
                <div className="text-gray-400 text-xs mb-1">Simulate Journeys:</div>
                <div className="grid grid-cols-1 gap-1">
                    <button
                        onClick={simulateNewUser}
                        className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
                    >
                        New User (Facebook)
                    </button>
                    <button
                        onClick={simulateMultiTouchJourney}
                        className="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700"
                    >
                        Multi-Touch Journey
                    </button>
                    <button
                        onClick={simulateReturningUser}
                        className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700"
                    >
                        Returning User
                    </button>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => trackTouch({ utm_source: 'test', utm_campaign: 'test', utm_medium: 'test' })}
                    className="flex-1 bg-yellow-600 text-white text-xs px-2 py-1 rounded hover:bg-yellow-700"
                >
                    Add Touch
                </button>
                <button
                    onClick={clearAttributionData}
                    className="flex-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};
