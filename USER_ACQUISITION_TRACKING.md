# User Acquisition Tracking - Nivel Experto Real

## Sistema Completo de Adquisición de Usuario

### 1. Conceptos Clave

#### **User ID Persistente**
- Cada usuario obtiene un ID único persistente
- ID se guarda en localStorage
- Sobrevive entre sesiones y reinicios del browser

#### **First Touch vs Last Touch**
- **First Touch:** Primera fuente que trajo al usuario
- **Last Touch:** Última fuente antes de la conversión
- **User Acquisition Source:** Fuente original (first touch)

#### **Traffic Source Classification**
```javascript
traffic_source: 'google_ads' | 'facebook' | 'instagram' | 'email' | 'direct' | 'organic'
```

### 2. Eventos Principales

#### **set_user_data** (Inicialización)
```javascript
{
  event: 'set_user_data',
  user_id: 'user_1672531200000_abc123',
  traffic_source: 'google_ads',
  campaign: 'test_campaign',
  medium: 'cpc',
  first_touch_timestamp: 1672531200000,
  last_touch_timestamp: 1672531200000,
  total_sessions: 1,
  user_acquisition_source: 'google_ads',
  user_type: 'new'
}
```

#### **Eventos Enriquecidos con User Data**
Todos los eventos del funnel ahora incluyen datos de usuario:

**add_to_cart con user data:**
```javascript
{
  event: 'add_to_cart',
  ecommerce: { ... },
  user_id: 'user_1672531200000_abc123',
  traffic_source: 'google_ads',
  campaign: 'test_campaign',
  medium: 'cpc',
  first_touch_source: 'google_ads',
  first_touch_campaign: 'test_campaign',
  user_acquisition_source: 'google_ads',
  total_sessions: 3,
  user_type: 'returning'
}
```

**purchase con user data:**
```javascript
{
  event: 'purchase',
  ecommerce: { ... },
  user_id: 'user_1672531200000_abc123',
  traffic_source: 'facebook', // last touch
  campaign: 'retargeting_01',
  medium: 'social',
  first_touch_source: 'google_ads', // first touch
  first_touch_campaign: 'test_campaign',
  user_acquisition_source: 'google_ads',
  total_sessions: 5,
  user_type: 'returning'
}
```

### 3. Implementación Técnica

#### **useUserAcquisitionTracking Hook**
```typescript
export const useUserAcquisitionTracking = (): {
  getUserAcquisitionData: () => UserAcquisitionData | null;
  injectUserData: (eventData: any) => any;
  setUserAcquisitionData: () => void;
}
```

#### **Captura Automática**
```typescript
// Generar user ID único
const generateUserId = (): string => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

// Capturar UTMs y guardar primera vez
const captureUTMParameters = (): any => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || 'direct',
    utm_medium: urlParams.get('utm_medium') || 'none',
    utm_campaign: urlParams.get('utm_campaign') || 'no_campaign',
    timestamp: Date.now(),
    landing_page: window.location.pathname + window.location.search
  };
};
```

#### **Inyección Automática en Eventos**
```typescript
const injectUserData = (eventData: any): any => {
  const userData = getUserAcquisitionData();
  if (userData) {
    return {
      ...eventData,
      user_id: userData.user_id,
      traffic_source: userData.last_touch.source,
      campaign: userData.last_touch.campaign,
      medium: userData.last_touch.medium,
      first_touch_source: userData.first_touch.source,
      first_touch_campaign: userData.first_touch.campaign,
      user_acquisition_source: userData.user_acquisition_source,
      total_sessions: userData.total_sessions,
      user_type: userData.total_sessions === 1 ? 'new' : 'returning'
    };
  }
  return eventData;
};

// Uso en eventos
const eventWithUser = injectUserData(baseEvent);
window.dataLayer.push(eventWithUser);
```

### 4. Flujo Completo de Usuario

#### **Nuevo Usuario (First Time)**
```
1. Usuario llega con UTMs: ?utm_source=google&utm_campaign=test
2. Se genera user_id: user_1672531200000_abc123
3. Se guarda first_touch: google, test, cpc
4. Se guarda last_touch: google, test, cpc
5. user_acquisition_source: google
6. user_type: new
```

#### **Usuario Recurrente (Returning)**
```
1. Mismo usuario retorna con diferentes UTMs: ?utm_source=facebook&utm_campaign=retargeting
2. user_id: user_1672531200000_abc123 (mismo)
3. first_touch: google, test, cpc (no cambia)
4. last_touch: facebook, retargeting, social (actualizado)
5. user_acquisition_source: google (no cambia)
6. user_type: returning
7. total_sessions: incrementado
```

#### **Usuario Convierte (Purchase)**
```
Evento purchase incluye:
- user_id: identificador único
- traffic_source: facebook (last touch)
- first_touch_source: google (original)
- user_acquisition_source: google (atribución)
- total_sessions: 5 (engagement)
- user_type: returning
```

### 5. Data Structure Completa

#### **UserAcquisitionData Interface**
```typescript
interface UserAcquisitionData {
  user_id: string;
  first_touch: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
    timestamp: number;
    landing_page: string;
  };
  last_touch: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
    timestamp: number;
    landing_page: string;
  };
  user_acquisition_source: string;
  total_sessions: number;
  total_page_views: number;
  first_visit: number;
  last_visit: number;
}
```

### 6. Casos de Uso Avanzados

#### **Multi-Touch Attribution**
```javascript
// Analizar camino completo del usuario
user_journey: {
  first_touch: { source: 'google', campaign: 'awareness' },
  second_touch: { source: 'facebook', campaign: 'retargeting' },
  third_touch: { source: 'email', campaign: 'conversion' },
  conversion: { source: 'direct', campaign: 'no_campaign' }
}

// Attribution models disponibles:
// - First Touch: google (original)
// - Last Touch: direct (conversión)
// - Linear: distribución entre todos
// - Time Decay: más peso a los más recientes
```

#### **Campaign Performance Analysis**
```javascript
// Performance por campaign
google_awareness: {
  users_acquired: 150,
  conversions: 15,
  revenue: $4,500,
  cac: $30,
  ltv: $300
}

facebook_retargeting: {
  users_acquired: 0, // no nuevos usuarios
  conversions: 25,
  revenue: $7,500,
  assisted_conversions: 10
}

email_conversion: {
  users_acquired: 0,
  conversions: 8,
  revenue: $2,400,
  assisted_conversions: 5
}
```

#### **User Journey Mapping**
```javascript
// Mapa de journey típico
google_awareness -> facebook_engagement -> email_conversion -> direct_purchase
     (first)           (middle)              (middle)          (last)

// Insights:
- Google: excelente para awareness pero necesita nurturing
- Facebook: bueno para retargeting y middle funnel
- Email: excelente para conversión final
- Direct: alta conversión pero sin atribución clara
```

### 7. Métricas Avanzadas

#### **Customer Acquisition Cost (CAC)**
```javascript
CAC = total_marketing_spend / new_customers_acquired

// Por campaign
google_cac = $1000 / 50 = $20
facebook_cac = $500 / 25 = $20
email_cac = $200 / 5 = $40
```

#### **Customer Lifetime Value (LTV)**
```javascript
LTV = average_revenue_per_customer * average_customer_lifespan

// Por acquisition source
google_ltv = $500 * 24 meses = $12,000
facebook_ltv = $300 * 18 meses = $5,400
direct_ltv = $200 * 12 meses = $2,400
```

#### **LTV:CAC Ratio**
```javascript
google_ratio = $12,000 / $20 = 600:1 (excelente)
facebook_ratio = $5,400 / $20 = 270:1 (bueno)
direct_ratio = $2,400 / $0 = infinito (malo, no attribution)
```

#### **Assisted Conversions**
```javascript
// Conversiones donde el usuario tuvo múltiples interacciones
assisted_conversions = users_with_multiple_touches_before_conversion

// Ejemplo:
- Usuario vio ad de google (first touch)
- Luego hizo click en ad de facebook (middle touch)
- Finalmente compró directo (last touch)
- Asignar crédito a todos los canales involucrados
```

### 8. Testing y Validación

#### **UserAcquisitionTester Tool**
- **Simulación de nuevos usuarios** con diferentes UTMs
- **Simulación de usuarios recurrentes** con diferentes fuentes
- **Visualización en tiempo real** de first/last touch
- **Testing de atribución multi-touch**

#### **URLs de Prueba**
```
# Nuevo usuario desde Google Ads
https://tu-site.com/?utm_source=google&utm_campaign=summer_sale&utm_medium=cpc&utm_term=seo&utm_content=banner

# Usuario recurrente desde Facebook
https://tu-site.com/?utm_source=facebook&utm_campaign=retargeting&utm_medium=social

# Tráfico directo
https://tu-site.com/
```

#### **Verificación en Console**
```javascript
// Verificar datos de usuario
localStorage.getItem('user_acquisition_data')

// Verificar eventos con user data
// Buscar en dataLayer eventos con user_id, traffic_source, etc.
```

### 9. Integración con Google Ads

#### **Enhanced Conversion Tracking**
```javascript
// Enhanced Conversions con user ID
gtag('config', 'GA_MEASUREMENT_ID', {
  user_id: 'user_1672531200000_abc123',
  enhanced_conversions: true
});

// Offline conversion import
gtag('event', 'conversion', {
  send_to: 'AW-123456789',
  user_id: 'user_1672531200000_abc123',
  value: 299.99,
  currency: 'USD'
});
```

#### **Custom Audiences**
```javascript
// Audiencia de high-value users
high_value_users = users_with_ltv_gt_1000

// Audiencia de first-touch google
google_first_touch = users_where_first_touch_source_equals_google

// Audiencia de multi-touch engaged
multi_touch_engaged = users_with_sessions_gt_3_and_multiple_sources
```

#### **Bid Adjustments**
```javascript
// Ajustar bids basados en acquisition source
if (user_acquisition_source === 'google') {
  // Aumentar bids - usuarios de alto valor
}
if (user_type === 'returning' && total_sessions > 5) {
  // Reducir bids - ya conocen la marca
}
if (ltv_cac_ratio > 300) {
  // Aumentar significativemente - muy rentables
}
```

### 10. Best Practices

#### **Data Quality**
```typescript
// Validar y limpiar datos
const validateUserData = (data: any): boolean => {
  return data.user_id && 
         data.first_touch && 
         data.last_touch && 
         data.total_sessions >= 1;
};

// Manejar errores gracefully
try {
  const userData = JSON.parse(localStorage.getItem('user_acquisition_data'));
  if (!validateUserData(userData)) {
    throw new Error('Invalid user data');
  }
} catch (error) {
  console.error('Error loading user data:', error);
  // Reset user data
  clearUserData();
}
```

#### **Privacy Compliance**
```typescript
// Opción de anonimización
const anonymizeUserData = (data: UserAcquisitionData): any => {
  return {
    ...data,
    user_id: hashUserId(data.user_id),
    first_touch: {
      ...data.first_touch,
      landing_page: removePII(data.first_touch.landing_page)
    }
  };
};

// Consent management
if (hasConsent) {
  saveUserData(userData);
} else {
  saveUserData(anonymizeUserData(userData));
}
```

#### **Performance Optimization**
```typescript
// Lazy loading de user data
const getUserDataLazy = () => {
  if (!userDataCache) {
    userDataCache = getUserAcquisitionData();
  }
  return userDataCache;
};

// Batch updates
const batchUpdateUserData = (updates: any[]) => {
  updates.forEach(update => {
    userData = { ...userData, ...update };
  });
  saveUserData(userData);
};
```

## Resumen

**Sistema de NIVEL EXPERTO REAL:**
- User ID persistente y único
- First Touch vs Last Touch tracking
- Multi-touch attribution completa
- Integración con todos los eventos del funnel
- Data structure completa y robusta
- Testing tools para validación
- Integración avanzada con Google Ads

Este sistema proporciona visibilidad completa del journey del usuario desde el primer contacto hasta la conversión final, permitiendo optimización avanzada de campañas y atribución precisa del valor del cliente.
