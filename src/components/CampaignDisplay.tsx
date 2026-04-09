import { UTMData } from '../types';

interface CampaignDisplayProps {
    utmData: UTMData;
}

export const CampaignDisplay: React.FC<CampaignDisplayProps> = ({ utmData }) => {
    if (!Object.values(utmData).some(param => param !== undefined)) {
        return null;
    }

    return (
        <section className="bg-gray-800 border-l-4 border-indigo-500 p-4 mx-6 mb-6">
            <h3 className="text-sm font-bold text-indigo-400 mb-2">?? CAMPAIGN DETECTED</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {utmData.utm_source && (
                    <div>
                        <span className="text-gray-400">Source:</span>
                        <span className="ml-2 text-white font-mono">{utmData.utm_source}</span>
                    </div>
                )}
                {utmData.utm_medium && (
                    <div>
                        <span className="text-gray-400">Medium:</span>
                        <span className="ml-2 text-white font-mono">{utmData.utm_medium}</span>
                    </div>
                )}
                {utmData.utm_campaign && (
                    <div>
                        <span className="text-gray-400">Campaign:</span>
                        <span className="ml-2 text-white font-mono">{utmData.utm_campaign}</span>
                    </div>
                )}
                {utmData.utm_term && (
                    <div>
                        <span className="text-gray-400">Term:</span>
                        <span className="ml-2 text-white font-mono">{utmData.utm_term}</span>
                    </div>
                )}
                {utmData.utm_content && (
                    <div>
                        <span className="text-gray-400">Content:</span>
                        <span className="ml-2 text-white font-mono">{utmData.utm_content}</span>
                    </div>
                )}
            </div>
        </section>
    );
};
