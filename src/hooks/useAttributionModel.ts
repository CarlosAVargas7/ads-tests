import { useEffect, useCallback } from 'react';

export interface AttributionData {
  user_id: string;
  first_touch: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
    timestamp: number;
    landing_page: string;
    device: string;
    browser: string;
  };
  last_touch: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
    timestamp: number;
    landing_page: string;
    device: string;
    browser: string;
  };
  touch_history: Array<{
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
    timestamp: number;
    landing_page: string;
    device: string;
    browser: string;
    session_number: number;
  }>;
  total_sessions: number;
  total_touches: number;
  days_since_first_touch: number;
  hours_since_last_touch: number;
  is_multi_touch: boolean;
  attribution_models: {
    first_touch: {
      source: string;
      medium: string;
      campaign: string;
      confidence: number;
    };
    last_touch: {
      source: string;
      medium: string;
      campaign: string;
      confidence: number;
    };
    linear: {
      sources: Array<{
        source: string;
        medium: string;
        campaign: string;
        weight: number;
        credit: number;
      }>;
    };
    time_decay: {
      sources: Array<{
        source: string;
        medium: string;
        campaign: string;
        weight: number;
        credit: number;
      }>;
    };
    position_based: {
      sources: Array<{
        source: string;
        medium: string;
        campaign: string;
        position: 'first' | 'middle' | 'last';
        weight: number;
        credit: number;
      }>;
    };
  };
}

export const useAttributionModel = (): {
  getAttributionData: () => AttributionData | null;
  trackTouch: (touchData: any) => void;
  getAttributionModels: () => any;
  getAttributionInsights: () => any;
  clearAttributionData: () => void;
} => {
  const getDeviceType = (): string => {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
  };

  const getBrowser = (): string => {
    const ua = navigator.userAgent;
    if (ua.indexOf('Chrome') > -1) return 'chrome';
    if (ua.indexOf('Safari') > -1) return 'safari';
    if (ua.indexOf('Firefox') > -1) return 'firefox';
    if (ua.indexOf('Edge') > -1) return 'edge';
    if (ua.indexOf('Opera') > -1) return 'opera';
    return 'unknown';
  };

  const generateUserId = (): string => {
    let userId = localStorage.getItem('attribution_user_id');
    if (!userId) {
      userId = 'attr_user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('attribution_user_id', userId);
    }
    return userId;
  };

  const getStoredAttributionData = (): AttributionData | null => {
    try {
      const stored = localStorage.getItem('attribution_data');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('?? Error reading attribution data:', error);
      return null;
    }
  };

  const calculateTimeDecayWeight = (touchTimestamp: number, firstTimestamp: number, lastTimestamp: number): number => {
    const totalTime = lastTimestamp - firstTimestamp;
    const touchTime = touchTimestamp - firstTimestamp;
    
    if (totalTime === 0) return 1;
    
    // Time decay: more recent touches get higher weight
    const recencyFactor = 1 - (touchTime / totalTime);
    return Math.max(0.1, recencyFactor); // Minimum 10% weight
  };

  const calculateLinearWeight = (totalTouches: number): number => {
    return 1 / totalTouches;
  };

  const calculatePositionWeight = (position: 'first' | 'middle' | 'last', totalTouches: number): number => {
    if (totalTouches === 1) return 1;
    
    switch (position) {
      case 'first':
        return 0.4; // 40% credit to first touch
      case 'last':
        return 0.4; // 40% credit to last touch
      case 'middle':
        return 0.2 / (totalTouches - 2); // Split remaining 20% among middle touches
      default:
        return 0;
    }
  };

  const calculateAttributionModels = (data: AttributionData): AttributionData['attribution_models'] => {
    const { first_touch, last_touch, touch_history } = data;
    
    // First Touch Attribution (100% to first touch)
    const firstTouchModel = {
      source: first_touch.source,
      medium: first_touch.medium,
      campaign: first_touch.campaign,
      confidence: touch_history.length === 1 ? 1.0 : 0.8 // Lower confidence if multiple touches
    };

    // Last Touch Attribution (100% to last touch)
    const lastTouchModel = {
      source: last_touch.source,
      medium: last_touch.medium,
      campaign: last_touch.campaign,
      confidence: touch_history.length === 1 ? 1.0 : 0.9 // High confidence for last touch
    };

    // Linear Attribution (Equal credit to all touches)
    const linearWeight = calculateLinearWeight(touch_history.length);
    const linearModel = {
      sources: touch_history.map((touch, index) => ({
        source: touch.source,
        medium: touch.medium,
        campaign: touch.campaign,
        weight: linearWeight,
        credit: linearWeight * 100 // Convert to percentage
      }))
    };

    // Time Decay Attribution (More credit to recent touches)
    const timeDecayModel = {
      sources: touch_history.map((touch, index) => {
        const weight = calculateTimeDecayWeight(touch.timestamp, first_touch.timestamp, last_touch.timestamp);
        return {
          source: touch.source,
          medium: touch.medium,
          campaign: touch.campaign,
          weight: weight,
          credit: weight * 100
        };
      })
    };

    // Position-Based Attribution (40% first, 40% last, 20% middle)
    const positionModel = {
      sources: touch_history.map((touch, index) => {
        let position: 'first' | 'middle' | 'last';
        if (index === 0) position = 'first';
        else if (index === touch_history.length - 1) position = 'last';
        else position = 'middle';

        const weight = calculatePositionWeight(position, touch_history.length);
        return {
          source: touch.source,
          medium: touch.medium,
          campaign: touch.campaign,
          position: position,
          weight: weight,
          credit: weight * 100
        };
      })
    };

    return {
      first_touch: firstTouchModel,
      last_touch: lastTouchModel,
      linear: linearModel,
      time_decay: timeDecayModel,
      position_based: positionModel
    };
  };

  const trackTouch = useCallback((touchData: any) => {
    const userId = generateUserId();
    const currentData = getStoredAttributionData();
    const now = Date.now();
    const device = getDeviceType();
    const browser = getBrowser();

    const touch = {
      source: touchData.utm_source || 'direct',
      medium: touchData.utm_medium || 'none',
      campaign: touchData.utm_campaign || 'no_campaign',
      term: touchData.utm_term || undefined,
      content: touchData.utm_content || undefined,
      timestamp: now,
      landing_page: window.location.pathname + window.location.search,
      device: device,
      browser: browser,
      session_number: (currentData?.total_sessions || 0) + 1
    };

    let attributionData: AttributionData;

    if (!currentData) {
      // First time user
      attributionData = {
        user_id: userId,
        first_touch: touch,
        last_touch: touch,
        touch_history: [touch],
        total_sessions: 1,
        total_touches: 1,
        days_since_first_touch: 0,
        hours_since_last_touch: 0,
        is_multi_touch: false,
        attribution_models: {} as any
      };
    } else {
      // Returning user
      const isSameSource = currentData.last_touch.source === touch.source &&
                         currentData.last_touch.medium === touch.medium &&
                         currentData.last_touch.campaign === touch.campaign;

      attributionData = {
        ...currentData,
        last_touch: touch,
        touch_history: [...currentData.touch_history, touch],
        total_sessions: currentData.total_sessions + 1,
        total_touches: currentData.total_touches + 1,
        days_since_first_touch: Math.floor((now - currentData.first_touch.timestamp) / (1000 * 60 * 60 * 24)),
        hours_since_last_touch: Math.floor((now - currentData.last_touch.timestamp) / (1000 * 60 * 60)),
        is_multi_touch: currentData.total_touches > 0 && !isSameSource
      };
    }

    // Calculate attribution models
    attributionData.attribution_models = calculateAttributionModels(attributionData);

    // Save updated data
    localStorage.setItem('attribution_data', JSON.stringify(attributionData));

    // Push attribution event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'attribution_touch',
      user_id: attributionData.user_id,
      touch_source: touch.source,
      touch_medium: touch.medium,
      touch_campaign: touch.campaign,
      touch_number: attributionData.total_touches,
      is_multi_touch: attributionData.is_multi_touch,
      days_since_first_touch: attributionData.days_since_first_touch,
      attribution_models: {
        first_touch_source: attributionData.attribution_models.first_touch.source,
        last_touch_source: attributionData.attribution_models.last_touch.source
      }
    });

    console.log('?? Attribution Touch Tracked:', {
      user_id: attributionData.user_id,
      touch_source: touch.source,
      touch_number: attributionData.total_touches,
      is_multi_touch: attributionData.is_multi_touch,
      first_source: attributionData.first_touch.source,
      last_source: attributionData.last_touch.source
    });
  }, []);

  const getAttributionData = (): AttributionData | null => {
    const data = getStoredAttributionData();
    if (data) {
      // Update time-based fields
      const now = Date.now();
      data.hours_since_last_touch = Math.floor((now - data.last_touch.timestamp) / (1000 * 60 * 60));
      data.days_since_first_touch = Math.floor((now - data.first_touch.timestamp) / (1000 * 60 * 60 * 24));
    }
    return data;
  };

  const getAttributionModels = () => {
    const data = getAttributionData();
    if (!data) return null;

    return {
      first_touch: data.attribution_models.first_touch,
      last_touch: data.attribution_models.last_touch,
      linear: data.attribution_models.linear,
      time_decay: data.attribution_models.time_decay,
      position_based: data.attribution_models.position_based,
      insights: {
        total_touches: data.total_touches,
        is_multi_touch: data.is_multi_touch,
        days_in_journey: data.days_since_first_touch,
        most_frequent_source: getMostFrequentSource(data.touch_history),
        journey_complexity: getJourneyComplexity(data.touch_history.length)
      }
    };
  };

  const getAttributionInsights = () => {
    const data = getAttributionData();
    if (!data) return null;

    const insights = {
      user_journey: {
        total_touches: data.total_touches,
        total_sessions: data.total_sessions,
        journey_duration_days: data.days_since_first_touch,
        is_multi_touch: data.is_multi_touch,
        complexity: data.total_touches === 1 ? 'simple' : data.total_touches <= 3 ? 'moderate' : 'complex'
      },
      attribution_summary: {
        first_source: data.first_touch.source,
        first_campaign: data.first_touch.campaign,
        last_source: data.last_touch.source,
        last_campaign: data.last_touch.campaign,
        source_changed: data.first_touch.source !== data.last_touch.source
      },
      models_comparison: {
        first_touch_confidence: data.attribution_models.first_touch.confidence,
        last_touch_confidence: data.attribution_models.last_touch.confidence,
        linear_diversity: data.attribution_models.linear.sources.length,
        time_decay_recent_focus: data.attribution_models.time_decay.sources[0]?.credit || 0
      },
      recommendations: {
        primary_attribution: data.is_multi_touch ? 'last_touch' : 'first_touch',
        secondary_attribution: data.is_multi_touch ? 'linear' : 'first_touch',
        optimization_focus: data.is_multi_touch ? 'middle_funnel' : 'top_funnel'
      }
    };

    return insights;
  };

  const getMostFrequentSource = (touches: any[]): string => {
    const sourceCounts: { [key: string]: number } = {};
    touches.forEach(touch => {
      sourceCounts[touch.source] = (sourceCounts[touch.source] || 0) + 1;
    });
    return Object.keys(sourceCounts).reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b);
  };

  const getJourneyComplexity = (touchCount: number): string => {
    if (touchCount === 1) return 'single_touch';
    if (touchCount <= 3) return 'low_complexity';
    if (touchCount <= 5) return 'medium_complexity';
    return 'high_complexity';
  };

  const clearAttributionData = (): void => {
    localStorage.removeItem('attribution_data');
    localStorage.removeItem('attribution_user_id');
    console.log('?? Attribution data cleared');
  };

  // Auto-track on hook initialization if UTMs are present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasUTMs = urlParams.get('utm_source') || urlParams.get('utm_campaign') || urlParams.get('utm_medium');
    
    if (hasUTMs) {
      const utmData = {
        utm_source: urlParams.get('utm_source') || 'direct',
        utm_medium: urlParams.get('utm_medium') || 'none',
        utm_campaign: urlParams.get('utm_campaign') || 'no_campaign',
        utm_term: urlParams.get('utm_term') || undefined,
        utm_content: urlParams.get('utm_content') || undefined
      };
      trackTouch(utmData);
    }
  }, [trackTouch]);

  return {
    getAttributionData,
    trackTouch,
    getAttributionModels,
    getAttributionInsights,
    clearAttributionData
  };
};
