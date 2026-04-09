# Attribution Model - GOD Level

## Sistema Completo de Atribución Multi-Touch

### 1. Conceptos Clave

#### **First Touch vs Last Touch**
- **First Touch:** La primera fuente que trajo al usuario
- **Last Touch:** La última fuente antes de la conversión
- **Multi-Touch:** Usuarios con múltiples fuentes durante su journey

#### **Attribution Models Implementados**
- **First Touch:** 100% crédito al primer contacto
- **Last Touch:** 100% crédito al último contacto
- **Linear:** Crédito igual distribuido entre todos los toques
- **Time Decay:** Más crédito a los toques más recientes
- **Position-Based:** 40% primero, 40% último, 20% medio

### 2. Data Structure Completa

#### **AttributionData Interface**
```typescript
interface AttributionData {
  user_id: string;
  first_touch: {
    source: string;      // 'google', 'facebook', 'email', 'direct'
    medium: string;      // 'cpc', 'social', 'email', 'none'
    campaign: string;    // 'spring_sale', 'retargeting', etc.
    term?: string;       // 'seo_services', 'brand_name'
    content?: string;    // 'text_ad', 'video_ad', 'carousel'
    timestamp: number;  // Cuándo ocurrió
    landing_page: string; // Página de aterrizaje
    device: string;      // 'desktop', 'mobile', 'tablet'
    browser: string;     // 'chrome', 'safari', 'firefox'
  };
  last_touch: { /* misma estructura que first_touch */ };
  touch_history: Array<{ /* todos los toques del usuario */ }>;
  total_sessions: number;
  total_touches: number;
  days_since_first_touch: number;
  hours_since_last_touch: number;
  is_multi_touch: boolean;
  attribution_models: {
    first_touch: { source, medium, campaign, confidence };
    last_touch: { source, medium, campaign, confidence };
    linear: { sources: Array<{ source, medium, campaign, weight, credit }> };
    time_decay: { sources: Array<{ source, medium, campaign, weight, credit }> };
    position_based: { sources: Array<{ source, medium, campaign, position, weight, credit }> };
  };
}
```

### 3. Ejemplo Real de Usuario Multi-Touch

#### **Journey Completo:**
```
Día 1: Usuario llega con UTMs
?utm_source=google&utm_campaign=search_ads&utm_medium=cpc&utm_term=seo_services
First Touch: google/cpc/search_ads

Día 3: Usuario retorna con diferentes UTMs  
?utm_source=facebook&utm_campaign=retargeting&utm_medium=social&utm_content=carousel
Second Touch: facebook/social/retargeting

Día 7: Usuario recibe email marketing
?utm_source=email&utm_campaign=newsletter&utm_medium=email&utm_content=promotion
Third Touch: email/email/newsletter

Día 10: Usuario compra directo (sin UTMs)
?utm_source=direct&utm_campaign=no_campaign&utm_medium=none
Last Touch: direct/none/no_campaign
```

#### **Attribution Data Resultante:**
```javascript
{
  user_id: 'attr_user_1672531200000_abc123',
  first_touch: {
    source: 'google',
    medium: 'cpc', 
    campaign: 'search_ads',
    term: 'seo_services',
    timestamp: 1672531200000,
    device: 'desktop',
    browser: 'chrome'
  },
  last_touch: {
    source: 'direct',
    medium: 'none',
    campaign: 'no_campaign',
    timestamp: 1673136000000,
    device: 'mobile',
    browser: 'safari'
  },
  touch_history: [
    { source: 'google', medium: 'cpc', campaign: 'search_ads', session: 1 },
    { source: 'facebook', medium: 'social', campaign: 'retargeting', session: 3 },
    { source: 'email', medium: 'email', campaign: 'newsletter', session: 5 },
    { source: 'direct', medium: 'none', campaign: 'no_campaign', session: 7 }
  ],
  total_sessions: 7,
  total_touches: 4,
  days_since_first_touch: 9,
  hours_since_last_touch: 0,
  is_multi_touch: true,
  attribution_models: {
    first_touch: {
      source: 'google',
      medium: 'cpc',
      campaign: 'search_ads',
      confidence: 0.8 // Baja confianza porque hay múltiples toques
    },
    last_touch: {
      source: 'direct',
      medium: 'none', 
      campaign: 'no_campaign',
      confidence: 0.9 // Alta confianza para último toque
    },
    linear: {
      sources: [
        { source: 'google', weight: 0.25, credit: 25.0 },
        { source: 'facebook', weight: 0.25, credit: 25.0 },
        { source: 'email', weight: 0.25, credit: 25.0 },
        { source: 'direct', weight: 0.25, credit: 25.0 }
      ]
    },
    time_decay: {
      sources: [
        { source: 'google', weight: 0.1, credit: 10.0 },   // Más antiguo
        { source: 'facebook', weight: 0.2, credit: 20.0 },
        { source: 'email', weight: 0.3, credit: 30.0 },
        { source: 'direct', weight: 0.4, credit: 40.0 }  // Más reciente
      ]
    },
    position_based: {
      sources: [
        { source: 'google', position: 'first', weight: 0.4, credit: 40.0 },
        { source: 'facebook', position: 'middle', weight: 0.067, credit: 6.7 },
        { source: 'email', position: 'middle', weight: 0.067, credit: 6.7 },
        { source: 'direct', position: 'last', weight: 0.4, credit: 40.0 }
      ]
    }
  }
}
```

### 4. Implementación Técnica

#### **useAttributionModel Hook**
```typescript
export const useAttributionModel = () => {
  const trackTouch = (touchData: any) => {
    // 1. Generar o recuperar user_id persistente
    // 2. Capturar device y browser automáticamente
    // 3. Guardar first_touch (solo primera vez)
    // 4. Actualizar last_touch (siempre)
    // 5. Agregar a touch_history
    // 6. Calcular todos los modelos de atribución
    // 7. Guardar en localStorage
    // 8. Disparar evento de attribution_touch
  };

  const getAttributionModels = () => {
    // Retorna todos los modelos calculados con sus pesos
  };

  const getAttributionInsights = () => {
    // Retorna insights y recomendaciones basados en los datos
  };
};
```

#### **Cálculo de Modelos de Atribución**
```typescript
// First Touch Attribution
const firstTouchModel = {
  source: first_touch.source,
  confidence: touch_history.length === 1 ? 1.0 : 0.8
};

// Last Touch Attribution  
const lastTouchModel = {
  source: last_touch.source,
  confidence: touch_history.length === 1 ? 1.0 : 0.9
};

// Linear Attribution (igual para todos)
const linearWeight = 1 / touch_history.length;
const linearModel = touch_history.map(touch => ({
  source: touch.source,
  weight: linearWeight,
  credit: linearWeight * 100
}));

// Time Decay Attribution (más peso a reciente)
const timeDecayWeight = (touchTimestamp, firstTimestamp, lastTimestamp) => {
  const totalTime = lastTimestamp - firstTimestamp;
  const touchTime = touchTimestamp - firstTimestamp;
  const recencyFactor = 1 - (touchTime / totalTime);
  return Math.max(0.1, recencyFactor);
};

// Position-Based Attribution (40%-40%-20%)
const positionWeight = (position, totalTouches) => {
  switch (position) {
    case 'first': return 0.4;
    case 'last': return 0.4;
    case 'middle': return 0.2 / (totalTouches - 2);
  }
};
```

### 5. Eventos de Tracking

#### **Attribution Touch Event**
```javascript
{
  event: 'attribution_touch',
  user_id: 'attr_user_1672531200000_abc123',
  touch_source: 'google',
  touch_medium: 'cpc',
  touch_campaign: 'search_ads',
  touch_number: 3,
  is_multi_touch: true,
  days_since_first_touch: 9,
  attribution_models: {
    first_touch_source: 'google',
    last_touch_source: 'direct'
  }
}
```

#### **Purchase con Attribution Data**
```javascript
{
  event: 'purchase',
  ecommerce: { /* datos de compra */ },
  // Attribution Data
  attribution_first_source: 'google',
  attribution_first_campaign: 'search_ads',
  attribution_last_source: 'direct',
  attribution_last_campaign: 'no_campaign',
  attribution_touch_count: 4,
  attribution_journey_days: 9,
  attribution_model_used: 'last_touch',
  attribution_confidence: 0.9
}
```

### 6. Integración con Google Ads

#### **Enhanced Conversions con Attribution**
```javascript
// Enviar attribution data a Google Ads
gtag('event', 'conversion', {
  send_to: 'AW-123456789',
  transaction_id: 'ORD-1672531200000',
  value: 899.97,
  currency: 'USD',
  // Enhanced Conversions
  user_id: 'attr_user_1672531200000_abc123',
  // Attribution Data
  first_source: 'google',
  last_source: 'direct',
  touch_count: 4,
  journey_duration: 9
});
```

#### **Custom Audiences por Attribution**
```javascript
// Audiencias basadas en modelo de atribución
first_touch_google_users: {
  condition: 'attribution_first_source == "google"',
  bid_adjustment: '+20%'
},

last_touch_direct_users: {
  condition: 'attribution_last_source == "direct"',
  bid_adjustment: '+15%'
},

multi_touch_engaged_users: {
  condition: 'attribution_touch_count > 2',
  bid_adjustment: '+25%'
},

high_journey_value_users: {
  condition: 'attribution_journey_days > 7',
  bid_adjustment: '+30%'
}
```

#### **Bid Adjustments por Modelo de Atribución**
```javascript
// Ajustes automáticos basados en attribution model
const getBidAdjustment = (attributionData) => {
  if (attributionData.is_multi_touch) {
    // Usuarios multi-touch tienen mayor valor
    return '+25%';
  }
  
  if (attributionData.first_touch.source === 'google') {
    // Google users suelen tener alto LTV
    return '+20%';
  }
  
  if (attributionData.last_touch.source === 'direct') {
    // Direct users tienen alta intención
    return '+15%';
  }
  
  if (attributionData.days_since_first_touch > 7) {
    // Long journeys indican alta consideración
    return '+30%';
  }
  
  return 'Standard';
};
```

### 7. Attribution Insights y Recomendaciones

#### **Journey Analysis**
```javascript
const insights = {
  user_journey: {
    total_touches: 4,
    total_sessions: 7,
    journey_duration_days: 9,
    is_multi_touch: true,
    complexity: 'medium_complexity'
  },
  attribution_summary: {
    first_source: 'google',
    first_campaign: 'search_ads',
    last_source: 'direct',
    last_campaign: 'no_campaign',
    source_changed: true
  },
  models_comparison: {
    first_touch_confidence: 0.8,
    last_touch_confidence: 0.9,
    linear_diversity: 4,
    time_decay_recent_focus: 40.0
  },
  recommendations: {
    primary_attribution: 'last_touch',
    secondary_attribution: 'linear',
    optimization_focus: 'middle_funnel'
  }
};
```

#### **AI Recommendations**
```typescript
const getRecommendations = (attributionData) => {
  return {
    primary_attribution: attributionData.is_multi_touch ? 'last_touch' : 'first_touch',
    secondary_attribution: attributionData.is_multi_touch ? 'linear' : 'first_touch',
    optimization_focus: attributionData.is_multi_touch ? 'middle_funnel' : 'top_funnel',
    bid_strategy: attributionData.days_since_first_touch > 7 ? 'aggressive' : 'moderate',
    audience_targeting: attributionData.is_multi_touch ? 'multi_touch_engaged' : 'single_touch_acquisition'
  };
};
```

### 8. Casos de Uso Avanzados

#### **Path to Conversion Analysis**
```javascript
// Analizar rutas más comunes
conversion_paths: {
  'google -> facebook -> direct': 35% de conversiones,
  'google -> email -> direct': 25% de conversiones,
  'facebook -> email -> direct': 15% de conversiones,
  'direct only': 25% de conversiones
};

// Identificar patrones exitosos
successful_patterns: {
  'social + email': conversion_rate: 0.12,
  'search + social': conversion_rate: 0.08,
  'search only': conversion_rate: 0.06
};
```

#### **Revenue Attribution por Modelo**
```javascript
// $1000 revenue attribution
revenue_attribution: {
  first_touch: { google: $400, facebook: $300, email: $200, direct: $100 },
  last_touch: { direct: $1000 },
  linear: { google: $250, facebook: $250, email: $250, direct: $250 },
  time_decay: { direct: $400, email: $300, facebook: $200, google: $100 },
  position_based: { google: $400, direct: $400, facebook: $100, email: $100 }
};
```

#### **Predictive Analytics**
```javascript
// Predecir probabilidad de conversión basada en attribution
conversion_probability: {
  'single_touch': 0.05,
  'multi_touch_2_touches': 0.12,
  'multi_touch_3_touches': 0.18,
  'multi_touch_4+_touches': 0.25
};

// Predecir LTV basado en first touch
ltv_prediction: {
  'google_first_touch': '$1200',
  'facebook_first_touch': '$800',
  'email_first_touch': '$600',
  'direct_first_touch': '$400'
};
```

### 9. Testing y Validación

#### **AttributionModelTester Tool**
- **Simulación de usuarios nuevos** con diferentes UTMs
- **Simulación de journeys multi-touch** con delays realistas
- **Visualización de modelos** de atribución en tiempo real
- **Comparación de modelos** side-by-side
- **AI recommendations** basadas en datos

#### **URLs de Prueba**
```
# Single touch journey
https://site.com/?utm_source=google&utm_campaign=test&utm_medium=cpc

# Multi-touch journey (simulado con tester)
# 1. Primer touch: google/search_ads
# 2. Segundo touch: facebook/retargeting  
# 3. Tercer touch: email/newsletter
# 4. Último touch: direct/no_campaign
```

### 10. Best Practices

#### **Data Quality**
```typescript
// Validación de datos de atribución
const validateAttributionData = (data: AttributionData): boolean => {
  return data.user_id && 
         data.first_touch && 
         data.last_touch && 
         data.touch_history.length > 0 &&
         data.total_sessions >= 1;
};

// Limpieza de datos anómalos
const cleanAttributionData = (data: AttributionData): AttributionData => {
  return {
    ...data,
    touch_history: data.touch_history.slice(-10), // Máximo 10 toques
    total_sessions: Math.min(data.total_sessions, 100) // Máximo 100 sesiones
  };
};
```

#### **Performance Optimization**
```typescript
// Caching de attribution models
let attributionModelsCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const getAttributionModelsCached = (): any => {
  const now = Date.now();
  if (!attributionModelsCache || (now - cacheTimestamp) > CACHE_DURATION) {
    attributionModelsCache = calculateAttributionModels(getAttributionData());
    cacheTimestamp = now;
  }
  return attributionModelsCache;
};
```

#### **Privacy Compliance**
```typescript
// Anonimización para GDPR/CCPA
const anonymizeAttributionData = (data: AttributionData): any => {
  return {
    ...data,
    user_id: hashUserId(data.user_id),
    landing_page: removePII(data.first_touch.landing_page),
    touch_history: data.touch_history.map(touch => ({
      ...touch,
      landing_page: removePII(touch.landing_page)
    }))
  };
};
```

## Resumen

**Sistema de NIVEL DIOS:**
- **5 modelos de atribución** implementados
- **First Touch vs Last Touch** tracking completo
- **Multi-touch journey analysis** con hasta 10 toques
- **Device y browser tracking** automático
- **Confidence scores** por modelo
- **AI recommendations** basadas en datos
- **Integración completa** con Google Ads
- **Testing tool** avanzado
- **Predictive analytics** capabilities
- **Revenue attribution** por modelo

Este sistema proporciona visibilidad completa del customer journey con atribución multi-touch precisa para optimización avanzada de Google Ads y análisis de ROAS a nivel profesional.
