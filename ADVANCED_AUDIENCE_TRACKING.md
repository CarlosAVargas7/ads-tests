# Advanced Audience Tracking - Nivel Experto para GA4 & Google Ads

## Sistema Completo de Segmentación de Audiencias

### 1. Tipos de Audiencias Avanzadas

#### **User Types (Clasificación Principal)**
- `new` - Primera vez en el sitio
- `returning` - Ha visitado antes, sin compra
- `browser` - Solo navega sin intención clara
- `engaged_user` - Alto engagement sin compra aún
- `buyer` - Ya ha comprado al menos una vez
- `high_value_user` - Comprador recurrente con alto LTV

#### **Cart Value Buckets**
- `none` - Carrito vacío
- `low` - Carrito < $50
- `medium` - Carrito $50-$200
- `high` - Carrito > $200

#### **Engagement Levels**
- `low` - Baja interacción (menos de 3 páginas, < 3 minutos)
- `medium` - Interacción moderada (3-10 páginas, 3-10 minutos)
- `high` - Alta interacción (> 10 páginas, > 10 minutos, acciones de intención)

### 2. Métricas Completas de Audiencia

#### **Behavioral Metrics**
```typescript
{
  session_count: 5,                    // Sesiones totales
  total_page_views: 23,                // Páginas vistas totales
  visited_pages: ['/home', '/tienda'], // Páginas visitadas
  time_on_site: 8,                     // Minutos en sitio
  last_visit: 1672531200000,          // Última visita
  first_visit: 1672531200000,         // Primera visita
  is_active_user: true                 // Activo últimas 48h
}
```

#### **Cart Metrics**
```typescript
{
  cart_items_count: 3,                // Items en carrito actual
  cart_abandon_count: 2,               // Veces que abandonó carrito
  cart_add_count: 5,                   // Veces que añadió al carrito
  total_cart_value: 450,               // Valor total histórico
  average_cart_value: 90               // Valor promedio por carrito
}
```

#### **Product Interaction Metrics**
```typescript
{
  products_viewed: ['serv-a', 'prod-b'], // Productos vistos
  categories_viewed: ['Servicios', 'Productos'], // Categorías vistas
  last_product_view: 'prod-b',        // Último producto visto
  product_views_count: 7               // Total de vistas de productos
}
```

#### **Engagement Metrics**
```typescript
{
  scroll_depth: 75,                    // % de scroll promedio
  form_interactions: 2,                 // Interacciones con formularios
  button_clicks: 8,                     // Clicks en botones
  time_to_first_action: 15              // Segundos a primera acción
}
```

#### **Purchase Metrics**
```typescript
{
  average_order_value: 350,             // AOV
  purchase_frequency: 'repeat',        // one_time | repeat | loyal
  days_since_last_purchase: 12,         // Días desde última compra
  customer_lifetime_value: 1400         // LTV total
}
```

### 3. Lógica de Clasificación Avanzada

#### **User Type Determination**
```typescript
if (total_purchases >= 3) {
  user_type = 'high_value_user';
} else if (total_purchases > 0) {
  user_type = 'buyer';
} else if (total_purchases === 0 && 
           session_count >= 3 && 
           total_page_views >= 10 &&
           time_on_site >= 5) {
  user_type = 'engaged_user';
} else if (session_count > 1) {
  user_type = 'returning';
} else {
  user_type = 'new';
}
```

#### **Engagement Level Logic**
```typescript
const hasHighIntentActions = form_interactions > 0 || button_clicks > 3;
const hasGoodEngagement = scroll_depth > 50 || time_on_site > 3 || product_views_count > 3;

if (hasHighIntentActions || total_purchases > 0) {
  engagement_level = 'high';
} else if (hasGoodEngagement || session_count > 2) {
  engagement_level = 'medium';
} else {
  engagement_level = 'low';
}
```

### 4. Eventos Enriquecidos con Audience Data

#### **Ejemplo Completo de Evento**
```javascript
{
  event: 'add_to_cart_with_audience',
  user_type: 'engaged_user',
  cart_value_bucket: 'medium',
  engagement_level: 'high',
  session_count: 5,
  total_page_views: 23,
  visited_pages: ['/home', '/tienda', '/checkout'],
  time_on_site: 8,
  cart_items_count: 2,
  product_views_count: 7,
  scroll_depth: 75,
  form_interactions: 2,
  button_clicks: 8,
  ecommerce: {
    currency: 'USD',
    value: 150,
    items: [...]
  }
}
```

### 5. Integración con GA4

#### **Custom Audiences en GA4**
```javascript
// Audiencias que se crean automáticamente
ga4_audiences: {
  'engaged_users': {
    condition: 'engagement_level == "high" && total_purchases == 0',
    criteria: {
      min_sessions: 3,
      min_page_views: 10,
      min_time_on_site: 300, // 5 minutes
      has_form_interaction: true
    }
  },
  'high_value_customers': {
    condition: 'user_type == "high_value_user"',
    criteria: {
      min_purchases: 3,
      min_ltv: 1000,
      purchase_frequency: 'repeat'
    }
  },
  'cart_abandoners': {
    condition: 'cart_abandon_count > 0 && total_purchases == 0',
    criteria: {
      min_cart_value: 50,
      max_days_since_abandon: 7
    }
  }
}
```

#### **GA4 Events con Audience Data**
```javascript
// Page view con audience data
gtag('event', 'page_view', {
  user_type: 'engaged_user',
  engagement_level: 'high',
  session_count: 5,
  cart_value_bucket: 'medium',
  custom_audience: 'high_intent_users'
});

// Ecommerce events con audience data
gtag('event', 'add_to_cart', {
  currency: 'USD',
  value: 150,
  user_type: 'engaged_user',
  engagement_level: 'high',
  custom_audience: 'ready_to_convert'
});
```

### 6. Integración con Google Ads

#### **Remarketing Lists**
```javascript
// Listas que se crean para Google Ads
google_ads_remarketing: {
  'high_intent_users': {
    condition: 'user_type == "engaged_user" && cart_value_bucket == "high"',
    bid_adjustment: '+25%',
    frequency_cap: 'normal'
  },
  'repeat_buyers': {
    condition: 'user_type == "high_value_user"',
    bid_adjustment: '+50%',
    frequency_cap: 'reduced'
  },
  'cart_abandoners': {
    condition: 'cart_abandon_count > 0 && cart_items_count > 0',
    bid_adjustment: '+15%',
    frequency_cap: 'increased'
  },
  'cold_traffic': {
    condition: 'user_type == "new" && engagement_level == "low"',
    bid_adjustment: '-10%',
    frequency_cap: 'increased'
  }
}
```

#### **Bid Adjustments Automáticos**
```javascript
// Lógica de ajuste de bids
const getBidAdjustment = (audienceData) => {
  if (audienceData.user_type === 'high_value_user') return '+50%';
  if (audienceData.user_type === 'engaged_user') return '+25%';
  if (audienceData.user_type === 'buyer') return '+15%';
  if (audienceData.cart_value_bucket === 'high') return '+20%';
  if (audienceData.engagement_level === 'high') return '+10%';
  if (audienceData.is_active_user === false) return '-20%';
  return 'Standard';
};
```

### 7. Advanced AudienceTester Tool

#### **Simulación Realista**
- **Engaged User:** 5 sesiones, 15 páginas, 8 minutos, 7 productos vistos
- **High Value User:** 4 compras, $350 AOV, $1400 LTV, repeat frequency
- **Page Views:** Simulación de 3, 10, 25 páginas vistas
- **Product Interactions:** Simulación de 2, 5, 10 productos vistos

#### **Métricas en Tiempo Real**
```typescript
// Datos que muestra el tester
{
  user_type: 'ENGAGED_USER',
  cart_value_bucket: 'MEDIUM',
  engagement_level: 'HIGH',
  is_active_user: 'YES',
  session_count: 5,
  total_page_views: 15,
  time_on_site: '8m',
  product_views_count: 7,
  average_order_value: 350,
  customer_lifetime_value: 1400
}
```

#### **GA4 & Ads Integration Insights**
```typescript
{
  ga4_audience: 'ENGAGED_USER',
  remarketing: 'Include',
  bid_adjustment: '+25%',
  frequency: 'Normal'
}
```

### 8. Casos de Uso Avanzados

#### **Journey Mapping por Audiencia**
```javascript
// New User Journey
new_user: {
  day_1: { session_count: 1, page_views: 3, engagement: 'low' },
  day_3: { session_count: 2, page_views: 8, engagement: 'medium' },
  day_7: { session_count: 3, page_views: 15, engagement: 'high' },
  day_10: { user_type: 'engaged_user', cart_add: true }
}

// High Value Journey
high_value_user: {
  month_1: { first_purchase: 150, frequency: 'one_time' },
  month_2: { second_purchase: 200, frequency: 'repeat' },
  month_3: { third_purchase: 250, frequency: 'repeat' },
  month_4: { user_type: 'high_value_user', ltv: 600 }
}
```

#### **Predictive Analytics**
```javascript
// Predicción de conversión
conversion_probability: {
  engaged_user_with_cart: 0.65,      // 65% probabilidad
  returning_user_with_history: 0.45, // 45% probabilidad
  new_user_with_engagement: 0.25,     // 25% probabilidad
  cold_traffic: 0.05                 // 5% probabilidad
}

// LTV Prediction
ltv_prediction: {
  high_value_user: 'likely_$2000_plus',
  engaged_user: 'potential_$800_1500',
  buyer: 'potential_$300_800',
  browser: 'potential_$50_300'
}
```

### 9. Métricas de Performance

#### **Audience Performance Metrics**
```javascript
// Conversion rates por audiencia
conversion_rates: {
  high_value_user: 0.12,            // 12%
  engaged_user: 0.08,               // 8%
  buyer: 0.15,                      // 15%
  returning: 0.05,                   // 5%
  new: 0.02                         // 2%
}

// Average Order Value por audiencia
aov_by_audience: {
  high_value_user: 450,
  engaged_user: 280,
  buyer: 320,
  returning: 180,
  new: 120
}

// Customer Lifetime Value por audiencia
ltv_by_audience: {
  high_value_user: 2400,
  engaged_user: 800,
  buyer: 600,
  returning: 200,
  new: 100
}
```

### 10. Best Practices

#### **Data Quality**
```typescript
// Validación de datos de audiencia
const validateAudienceData = (data: AudienceData): boolean => {
  return data.session_count >= 0 &&
         data.total_page_views >= 0 &&
         data.time_on_site >= 0 &&
         data.product_views_count >= 0 &&
         data.engagement_level in ['low', 'medium', 'high'];
};

// Limpieza de datos anómalos
const cleanAudienceData = (data: AudienceData): AudienceData => {
  return {
    ...data,
    time_on_site: Math.min(data.time_on_site, 1440), // Max 24h
    total_page_views: Math.min(data.total_page_views, 1000), // Max 1000
    session_count: Math.min(data.session_count, 365) // Max 365 sesiones
  };
};
```

#### **Privacy Compliance**
```typescript
// Anonimización para GDPR/CCPA
const anonymizeAudienceData = (data: AudienceData): any => {
  return {
    ...data,
    visited_pages: data.visited_pages.map(p => hashPath(p)),
    products_viewed: data.products_viewed.map(p => hashProductId(p)),
    user_id: hashUserId(data.user_id)
  };
};
```

#### **Performance Optimization**
```typescript
// Caching de audience data
let audienceDataCache: AudienceData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getAudienceDataCached = (): AudienceData => {
  const now = Date.now();
  if (!audienceDataCache || (now - cacheTimestamp) > CACHE_DURATION) {
    audienceDataCache = getAudienceData();
    cacheTimestamp = now;
  }
  return audienceDataCache!;
};
```

## Resumen

**Sistema de NIVEL EXPERTO REAL:**
- 6 tipos de audiencias avanzadas
- 30+ métricas detalladas de comportamiento
- Lógica sofisticada de clasificación
- Integración completa con GA4
- Conexión directa con Google Ads
- Tool de testing realista
- Métricas de performance completas
- Predictive analytics capabilities

Este sistema proporciona segmentación ultra-precisa para optimización automática de campañas en Google Ads y análisis avanzado en GA4.
