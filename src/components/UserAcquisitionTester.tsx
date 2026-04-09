import { useUserAcquisitionTracking } from '../hooks/useUserAcquisitionTracking';

export const UserAcquisitionTester: React.FC = () => {
    const { getUserAcquisitionData, setUserAcquisitionData } = useUserAcquisitionTracking();
    const userData = getUserAcquisitionData();

    const simulateNewUser = () => {
        // Clear existing user data
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_acquisition_data');

        // Simulate visit with UTMs
        window.location.href = '/?utm_source=google&utm_campaign=test_campaign&utm_medium=cpc&utm_term=seo&utm_content=banner';
    };

    const simulateReturningUser = () => {
        // Simulate return visit with different UTMs
        window.location.href = '/?utm_source=facebook&utm_campaign=retargeting&utm_medium=social';
    };

    const simulateDirectUser = () => {
        // Simulate direct visit (no UTMs)
        window.location.href = '/';
    };

    const clearUserData = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_acquisition_data');
        window.location.reload();
    };

    const getAcquisitionColor = (source: string) => {
        switch (source) {
            case 'google': return 'text-blue-400';
            case 'facebook': return 'text-indigo-400';
            case 'instagram': return 'text-pink-400';
            case 'email': return 'text-green-400';
            case 'direct': return 'text-gray-400';
            default: return 'text-yellow-400';
        }
    };

    const getUserTypeColor = (type: string) => {
        switch (type) {
            case 'new': return 'text-green-400';
            case 'returning': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 w-80 h-96 overflow-y-auto flex flex-col">
            <h3 className="text-white font-semibold mb-3 text-sm">User Acquisition Tracking</h3>

            {/* Current User Data */}
            {userData && (
                <div className="space-y-2 mb-3 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-400">User ID:</span>
                        <span className="text-white font-mono text-xs">
                            {userData.user_id.substring(0, 12)}...
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">User Type:</span>
                        <span className={getUserTypeColor(userData.total_sessions === 1 ? 'new' : 'returning')}>
                            {userData.total_sessions === 1 ? 'NEW' : 'RETURNING'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Sessions:</span>
                        <span className="text-white">{userData.total_sessions}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Page Views:</span>
                        <span className="text-white">{userData.total_page_views}</span>
                    </div>
                </div>
            )}

            {/* First Touch */}
            {userData && (
                <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
                    <div className="text-gray-400 font-medium mb-1">First Touch:</div>
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Source:</span>
                            <span className={getAcquisitionColor(userData.first_touch.source)}>
                                {userData.first_touch.source}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Campaign:</span>
                            <span className="text-white">{userData.first_touch.campaign}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Medium:</span>
                            <span className="text-white">{userData.first_touch.medium}</span>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                            {new Date(userData.first_touch.timestamp).toLocaleString()}
                        </div>
                    </div>
                </div>
            )}

            {/* Last Touch */}
            {userData && (
                <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
                    <div className="text-gray-400 font-medium mb-1">Last Touch:</div>
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Source:</span>
                            <span className={getAcquisitionColor(userData.last_touch.source)}>
                                {userData.last_touch.source}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Campaign:</span>
                            <span className="text-white">{userData.last_touch.campaign}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Medium:</span>
                            <span className="text-white">{userData.last_touch.medium}</span>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                            {new Date(userData.last_touch.timestamp).toLocaleString()}
                        </div>
                    </div>
                </div>
            )}

            {/* Simulation Controls */}
            <div className="space-y-2 mb-3">
                <div className="text-gray-400 text-xs mb-1">Simulate User Journey:</div>
                <div className="space-y-1">
                    <button
                        onClick={simulateNewUser}
                        className="w-full bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
                    >
                        New User (Google CPC)
                    </button>
                    <button
                        onClick={simulateReturningUser}
                        className="w-full bg-indigo-600 text-white text-xs px-2 py-1 rounded hover:bg-indigo-700"
                    >
                        Returning User (Facebook Social)
                    </button>
                    <button
                        onClick={simulateDirectUser}
                        className="w-full bg-gray-600 text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
                    >
                        Direct Traffic
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => setUserAcquisitionData()}
                    className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700"
                >
                    Refresh Data
                </button>
                <button
                    onClick={clearUserData}
                    className="flex-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                >
                    Clear All
                </button>
            </div>

            {/* Attribution Insights */}
            {userData && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="text-gray-400 text-xs mb-2">Attribution Insights:</div>
                    <div className="space-y-1 text-xs">
                        <div className="text-gray-300">
                            Acquisition: {userData.user_acquisition_source}
                        </div>
                        <div className="text-gray-300">
                            Attribution Model: First Touch
                        </div>
                        <div className="text-gray-300">
                            User Journey: {userData.total_sessions} sessions
                        </div>
                        <div className="text-gray-300">
                            Engagement: {userData.total_page_views} page views
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
