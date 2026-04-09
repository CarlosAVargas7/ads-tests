import { useState } from 'react';
import { useUTMTracking } from '../hooks/useUTMTracking';

export const UTMTester: React.FC = () => {
    const { getStoredUTMData, clearUTMData } = useUTMTracking();
    const [testParams, setTestParams] = useState({
        utm_source: 'google',
        utm_campaign: 'spring_sale',
        utm_medium: 'cpc',
        utm_term: 'seo_consulting',
        utm_content: 'banner_ad'
    });

    const handleInputChange = (field: string, value: string) => {
        setTestParams(prev => ({ ...prev, [field]: value }));
    };

    const simulateUTMVisit = () => {
        // Build URL with UTM parameters
        const params = new URLSearchParams();
        Object.entries(testParams).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });

        const url = `${window.location.pathname}?${params.toString()}`;
        window.location.href = url;
    };

    const currentUTMData = getStoredUTMData();

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 w-80 h-96 overflow-y-auto flex flex-col">
            <h3 className="text-white font-semibold mb-3 text-sm">UTM Parameter Tester</h3>

            {/* Current UTM Data */}
            {currentUTMData && (
                <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
                    <div className="text-green-400 font-medium mb-1">Current UTM Data:</div>
                    {Object.entries(currentUTMData).map(([key, value]) => (
                        value && <div key={key} className="text-gray-300">
                            {key}: {value}
                        </div>
                    ))}
                </div>
            )}

            {/* Test Form */}
            <div className="space-y-2 mb-3">
                {Object.entries(testParams).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                        <label className="text-gray-400 text-xs w-20">{key}:</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="flex-1 bg-gray-700 text-white text-xs px-2 py-1 rounded"
                            placeholder={key}
                        />
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={simulateUTMVisit}
                    className="flex-1 bg-indigo-600 text-white text-xs px-2 py-1 rounded hover:bg-indigo-700"
                >
                    Simulate Visit
                </button>
                <button
                    onClick={clearUTMData}
                    className="flex-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                >
                    Clear UTM
                </button>
            </div>

            {/* Quick Test Links */}
            <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="text-gray-400 text-xs mb-2">Quick Tests:</div>
                <div className="space-y-1">
                    <button
                        onClick={() => window.location.href = '/?utm_source=google&utm_campaign=test1&utm_medium=cpc'}
                        className="block w-full text-left bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded hover:bg-gray-600"
                    >
                        Google CPC Campaign
                    </button>
                    <button
                        onClick={() => window.location.href = '/?utm_source=facebook&utm_campaign=spring_sale&utm_medium=social'}
                        className="block w-full text-left bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded hover:bg-gray-600"
                    >
                        Facebook Social Campaign
                    </button>
                    <button
                        onClick={() => window.location.href = '/?utm_source=email&utm_campaign=newsletter&utm_medium=email'}
                        className="block w-full text-left bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded hover:bg-gray-600"
                    >
                        Email Newsletter
                    </button>
                </div>
            </div>
        </div>
    );
};
