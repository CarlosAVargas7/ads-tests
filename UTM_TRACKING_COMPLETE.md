# UTM Tracking Completo - Nivel Experto

## Sistema Mejorado de Persistencia y Tracking

### 1. Persistencia Completa en localStorage

**Antes:** `sessionStorage` (se pierde al cerrar browser)
**Ahora:** `localStorage` (persiste entre sesiones)

```typescript
// Captura automática de UTMs
localStorage.setItem('utm_data', JSON.stringify({
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  utm_term: 'seo_consulting',
  utm_content: 'banner_ad',
  timestamp: 1672531200000
}));
```

### 2. Función injectUTMData - Inyección Automática

**Nueva función clave:**
```typescript
const injectUTMData = (eventData: any): any => {
  const utmData = getStoredUTMData();
  if (utmData) {
    return {
      ...eventData,
      utm_source: utmData.utm_source,
      utm_campaign: utmData.utm_campaign,
      utm_medium: utmData.utm_medium,
      utm_term: utmData.utm_term,
      utm_content: utmData.utm_content,
      utm_timestamp: utmData.timestamp
    };
  }
  return eventData;
};
```

### 3. Eventos Enriquecidos con UTM Data

#### Todos los eventos del funnel ahora incluyen UTMs:

**add_to_cart**
```javascript
{
  event: 'add_to_cart',
  ecommerce: { ... },
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  utm_term: 'seo_consulting',
  utm_content: 'banner_ad',
  utm_timestamp: 1672531200000
}
```

**remove_from_cart**
```javascript
{
  event: 'remove_from_cart',
  ecommerce: { ... },
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // ... todos los parámetros UTM
}
```

**update_cart**
```javascript
{
  event: 'update_cart',
  ecommerce: { ... },
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // ... todos los parámetros UTM
}
```

**view_cart**
```javascript
{
  event: 'view_cart',
  ecommerce: { ... },
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // ... todos los parámetros UTM
}
```

**begin_checkout**
```javascript
{
  event: 'begin_checkout',
  ecommerce: { ... },
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // ... todos los parámetros UTM
}
```

**add_payment_info**
```javascript
{
  event: 'add_payment_info',
  ecommerce: { ... },
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // ... todos los parámetros UTM
}
```

**purchase** (CheckoutSuccess.tsx)
```javascript
{
  event: 'purchase',
  ecommerce: { ... },
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  utm_term: 'seo_consulting',
  utm_content: 'banner_ad',
  utm_timestamp: 1672531200000
}
```

### 4. Implementación Técnica

#### useCart.ts
```typescript
// Import y uso
const { injectUTMData } = useUTMTracking();

// En cada evento
const addCartEvent = {
  event: "add_to_cart",
  ecommerce: { ... }
};

const addCartEventWithUTM = injectUTMData(addCartEvent);
window.dataLayer.push(addCartEventWithUTM);
```

#### Cart.tsx
```typescript
// View cart con UTM
const viewCartEvent = {
  event: 'view_cart',
  ecommerce: { ... }
};

const viewCartEventWithUTM = injectUTMData(viewCartEvent);
window.dataLayer.push(viewCartEventWithUTM);

// Begin checkout con UTM
const beginCheckoutEvent = {
  event: 'begin_checkout',
  ecommerce: { ... }
};

const beginCheckoutEventWithUTM = injectUTMData(beginCheckoutEvent);
window.dataLayer.push(beginCheckoutEventWithUTM);
```

#### CheckoutSuccess.tsx
```javascript
// Purchase con UTM (ya implementado)
const purchaseEvent = {
  event: 'purchase',
  ecommerce: { ... }
};

// Add UTM data if available
if (utmData) {
  Object.assign(purchaseEvent, {
    utm_source: utmData.utm_source,
    utm_campaign: utmData.utm_campaign,
    utm_medium: utmData.utm_medium,
    utm_term: utmData.utm_term,
    utm_content: utmData.utm_content,
    utm_timestamp: utmData.timestamp
  });
}
```

### 5. Flujo Completo de Atribución

```
Usuario llega con UTMs
       |
       v
Captura automática en localStorage
       |
       v
add_to_cart (con UTMs) -> view_cart (con UTMs) -> begin_checkout (con UTMs)
       |
       v
add_payment_info (con UTMs) -> purchase (con UTMs)
```

### 6. Beneficios para Google Ads

#### Atribución Completa
- **Cada conversión** tiene su origen UTM completo
- **Funnel tracking** con atribución en cada paso
- **Cross-session attribution** - UTMs persisten entre visitas

#### Optimización Automática
```javascript
// Google Ads puede ver el funnel completo:
utm_source: 'google' -> add_to_cart -> begin_checkout -> purchase
utm_source: 'facebook' -> add_to_cart -> abandon
utm_source: 'email' -> view_cart -> add_to_cart -> purchase
```

#### Métricas Avanzadas
- **CPL por UTM source** - Costo por lead por canal
- **ROAS por campaign** - Retorno por campaña específica
- **Funnel completion rate** por medium
- **Cart abandonment por source**

### 7. Testing de UTM Tracking

#### URLs de Prueba
```
https://tu-site.com/?utm_source=google&utm_campaign=test1&utm_medium=cpc&utm_term=seo&utm_content=banner
https://tu-site.com/?utm_source=facebook&utm_campaign=spring_sale&utm_medium=social
https://tu-site.com/?utm_source=email&utm_campaign=newsletter&utm_medium=email
```

#### Verificación en Console
```javascript
// Verificar datos guardados
localStorage.getItem('utm_data')

// Verificar eventos con UTM
// Buscar en dataLayer eventos con utm_source, utm_campaign, etc.
```

### 8. Casos de Uso Avanzados

#### Multi-session Attribution
```
Sesión 1: Usuario llega con utm_source=google -> add_to_cart
Sesión 2 (días después): Usuario retorna -> purchase
Resultado: Purchase atribuido a google (gracias a localStorage)
```

#### Campaign Performance Analysis
```javascript
// Analizar performance por campaña
google_campaign_spring_sale: {
  add_to_cart: 150,
  begin_checkout: 80,
  purchase: 45,
  revenue: $13,500,
  roas: 4.5
}
```

#### Medium Comparison
```javascript
// Comparar medios
cpc: { conversion_rate: 3.2%, roas: 3.8 }
social: { conversion_rate: 2.8%, roas: 4.2 }
email: { conversion_rate: 5.1%, roas: 6.1 }
```

### 9. Best Practices

#### UTM Parameters Consistentes
- `utm_source`: google, facebook, instagram, email
- `utm_medium`: cpc, social, email, organic
- `utm_campaign`: spring_sale, black_friday, newsletter_01
- `utm_term`: keywords específicos
- `utm_content`: banner_ad, text_link, product_image

#### Limpieza de Datos
```typescript
// Limpiar UTMs después de purchase (opcional)
const clearUTMData = () => {
  localStorage.removeItem('utm_data');
};
```

#### Validación de Datos
```typescript
// Validar UTM data antes de usar
const getStoredUTMData = (): UTMData | null => {
  try {
    const stored = localStorage.getItem('utm_data');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading UTM data:', error);
    return null;
  }
};
```

## Resumen

**Sistema ahora de NIVEL EXPERTO:**
- Persistencia completa en localStorage
- Inyección automática en TODOS los eventos
- Atribución multi-session
- Tracking completo del funnel
- Datos para optimización avanzada de Google Ads

Todos los eventos del ecommerce funnel ahora incluyen UTM data para atribución completa y optimización automática!
