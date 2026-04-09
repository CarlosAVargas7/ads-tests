# Audiencias Avanzadas - Google Ads Segmentation

## Tipos de Audiencias Implementadas

### 1. User Type (user_type)
**Segmentación por tipo de usuario:**
- `new` - Primera vez en el sitio
- `returning` - Ha visitado antes, pero no ha comprado
- `buyer` - Ya ha realizado al menos una compra
- `browser` - Solo navega sin acción de compra

### 2. Cart Value Bucket (cart_value_bucket)
**Segmentación por valor del carrito:**
- `none` - Carrito vacío
- `low` - Carrito < $100
- `medium` - Carrito $100-$500
- `high` - Carrito > $500

### 3. Engagement Level (engagement_level)
**Segmentación por nivel de engagement:**
- `low` - Nueva visita, sin interacciones
- `medium` - Varias visitas o items en carrito
- `high` - Ha comprado o tiene carrito activo

## Datos de Audiencia en Eventos

### Eventos Enriquecidos con Audiencias:

#### 1. add_to_cart_with_audience
```javascript
{
  event: 'add_to_cart_with_audience',
  user_type: 'new',
  cart_value_bucket: 'medium',
  session_count: 1,
  total_purchases: 0,
  cart_items_count: 2,
  engagement_level: 'medium',
  ecommerce: { ... }
}
```

#### 2. purchase_with_audience
```javascript
{
  event: 'purchase_with_audience',
  user_type: 'buyer',
  cart_value_bucket: 'high',
  session_count: 3,
  total_purchases: 1,
  purchase_value: 599.99,
  customer_lifetime_value: 599.99,
  engagement_level: 'high'
}
```

#### 3. page_view_with_audience
```javascript
{
  event: 'page_view_with_audience',
  user_type: 'returning',
  cart_value_bucket: 'none',
  session_count: 2,
  engagement_level: 'low',
  page_location: '/tienda'
}
```

## Estrategias de Google Ads por Audiencia

### 1. New Users (user_type: 'new')
**Objetivo:** Conversión inicial
- **Bidding:** tCPA agresivo
- **Creatives:** Brand awareness + ofertas
- **Frequency:** Alta
- **Budget:** 40% del total

### 2. Returning Users (user_type: 'returning')
**Objetivo:** Recordatorio y conversión
- **Bidding:** tROAS moderado
- **Creatives:** Remarketing dinámico
- **Frequency:** Media
- **Budget:** 30% del total

### 3. High Value Cart (cart_value_bucket: 'high')
**Objetivo:** Cierre de conversión
- **Bidding:** tROAS alto
- **Creatives:** Urgencia + beneficios premium
- **Frequency:** Alta
- **Budget:** 20% del total

### 4. Buyers (user_type: 'buyer')
**Objetivo:** Upsell y retención
- **Bidding:** tCPA bajo (upsell)
- **Creatives:** Cross-sell y fidelización
- **Frequency:** Baja
- **Budget:** 10% del total

## Combinaciones de Audiencias Poderosas

### 1. High Value + Returning
```javascript
user_type: 'returning'
cart_value_bucket: 'high'
```
**Estrategia:** Máxima prioridad, bidding agresivo

### 2. New + Medium Cart
```javascript
user_type: 'new'
cart_value_bucket: 'medium'
```
**Estrategia:** Nuturing sequence, descuentos progresivos

### 3. Buyer + Low Engagement
```javascript
user_type: 'buyer'
engagement_level: 'low'
```
**Estrategia:** Reactivation campaign, nuevos productos

## Métricas de Audiencia para Google Ads

### Conversion Rate por Audiencia
- **New:** 1-2%
- **Returning:** 3-5%
- **Buyer:** 8-12%

### ROAS por Audiencia
- **New:** 2:1 - 3:1
- **Returning:** 4:1 - 6:1
- **Buyer:** 8:1 - 12:1

### CPA por Audiencia
- **New:** $50 - $100
- **Returning:** $25 - $50
- **Buyer:** $10 - $25

## Implementación Técnica

### Persistencia de Datos
```javascript
// localStorage para audiencias
localStorage.setItem('audience_data', JSON.stringify({
  user_type: 'returning',
  cart_value_bucket: 'medium',
  session_count: 3,
  total_purchases: 1,
  engagement_level: 'high'
}));
```

### Actualización Automática
```javascript
// Cada evento actualiza datos de audiencia
const updateAudienceData = (cart, eventType) => {
  // Recalcular user_type, cart_value_bucket, engagement_level
  // Guardar en localStorage
  // Enviar a Google Ads
};
```

## Testing de Audiencias

### Audience Tester Tool
- **Simulación de valores de carrito**
- **Cambio de tipo de usuario**
- **Visualización en tiempo real**
- **Insights de bidding**

### Casos de Test
1. **Nuevo usuario** + carrito bajo
2. **Usuario recurrente** + carrito alto
3. **Buyer** + re-engagement
4. **Browser** + alta frecuencia

## Optimización Continua

### Métricas a Monitorear
- **Audience growth rate**
- **Cross-audience conversion paths**
- **Audience ROAS**
- **Audience CPA**

### Acciones Automáticas
- **Adjust bids** por performance de audiencia
- **Reallocate budget** a mejores audiencias
- **Update creatives** por segmento
- **Modify frequency** por engagement

Este sistema de audiencias avanzadas permite segmentación precisa para optimización automática de Google Ads.
