# Complete Ecommerce Funnel - UTMs + Events + User Data

## Sistema Completo y Conectado

### 1. Flujo Completo del Funnel

```
UTM Parameters
       |
       v
view_item (Step 1: Awareness)
       |
       v
add_to_cart (Step 3: Conversion)
       |
       v
view_cart (Step 4: Conversion)
       |
       v
begin_checkout (Step 5: Conversion)
       |
       v
add_payment_info (Step 6: Conversion)
       |
       v
purchase (Step 7: Purchase)
```

### 2. Eventos del Funnel con Datos Completos

#### **view_item** - Awareness Stage
```javascript
{
  event: 'view_item',
  ecommerce: {
    currency: 'USD',
    value: 299.99,
    items: [{
      item_name: 'SEO Consulting Service',
      item_id: 'seo-consulting',
      price: 299.99,
      item_category: 'Servicios',
      item_variant: 'service',
      quantity: 1
    }]
  },
  // UTM Data
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  utm_term: 'seo_consulting',
  utm_content: 'banner_ad',
  // User Data
  user_id: 'user_1672531200000_abc123',
  traffic_source: 'google',
  first_touch_source: 'google',
  user_acquisition_source: 'google',
  total_sessions: 3,
  user_type: 'returning',
  // Audience Data
  cart_value_bucket: 'none',
  engagement_level: 'high',
  // Funnel Context
  funnel_step: 1,
  funnel_stage: 'awareness',
  session_id: 'session_1672531200000_def456',
  timestamp: 1672531200000
}
```

#### **add_to_cart** - Conversion Stage
```javascript
{
  event: 'add_to_cart',
  ecommerce: {
    currency: 'USD',
    value: 599.98,
    items: [{
      item_name: 'SEO Consulting Service',
      item_id: 'seo-consulting',
      price: 299.99,
      item_category: 'Servicios',
      item_variant: 'service',
      quantity: 2
    }]
  },
  // UTM Data
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // User Data
  user_id: 'user_1672531200000_abc123',
  traffic_source: 'google',
  user_type: 'returning',
  // Audience Data
  cart_value_bucket: 'medium',
  engagement_level: 'high',
  // Funnel Context
  funnel_step: 3,
  funnel_stage: 'conversion',
  session_id: 'session_1672531200000_def456'
}
```

#### **view_cart** - Conversion Stage
```javascript
{
  event: 'view_cart',
  ecommerce: {
    currency: 'USD',
    value: 899.97,
    items: [
      {
        item_name: 'SEO Consulting Service',
        item_id: 'seo-consulting',
        price: 299.99,
        item_category: 'Servicios',
        item_variant: 'service',
        quantity: 2
      },
      {
        item_name: 'Web Development',
        item_id: 'web-dev',
        price: 299.99,
        item_category: 'Servicios',
        item_variant: 'service',
        quantity: 1
      }
    ]
  },
  // UTM Data
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // User Data
  user_id: 'user_1672531200000_abc123',
  traffic_source: 'google',
  user_type: 'returning',
  // Audience Data
  cart_value_bucket: 'high',
  engagement_level: 'high',
  // Funnel Context
  funnel_step: 4,
  funnel_stage: 'conversion',
  session_id: 'session_1672531200000_def456'
}
```

#### **begin_checkout** - Conversion Stage
```javascript
{
  event: 'begin_checkout',
  ecommerce: {
    currency: 'USD',
    value: 899.97,
    items: [/* same items as view_cart */]
  },
  // UTM Data
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // User Data
  user_id: 'user_1672531200000_abc123',
  traffic_source: 'google',
  user_type: 'returning',
  // Audience Data
  cart_value_bucket: 'high',
  engagement_level: 'high',
  // Funnel Context
  funnel_step: 5,
  funnel_stage: 'conversion',
  session_id: 'session_1672531200000_def456'
}
```

#### **add_payment_info** - Conversion Stage
```javascript
{
  event: 'add_payment_info',
  ecommerce: {
    currency: 'USD',
    value: 899.97,
    items: [/* same items as view_cart */]
  },
  // UTM Data
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // User Data
  user_id: 'user_1672531200000_abc123',
  traffic_source: 'google',
  user_type: 'returning',
  // Audience Data
  cart_value_bucket: 'high',
  engagement_level: 'high',
  // Funnel Context
  funnel_step: 6,
  funnel_stage: 'conversion',
  session_id: 'session_1672531200000_def456'
}
```

#### **purchase** - Purchase Stage
```javascript
{
  event: 'purchase',
  ecommerce: {
    currency: 'USD',
    value: 899.97,
    transaction_id: 'ORD-1672531200000',
    items: [/* same items as view_cart */]
  },
  // UTM Data
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc',
  // User Data
  user_id: 'user_1672531200000_abc123',
  traffic_source: 'google',
  first_touch_source: 'google',
  user_acquisition_source: 'google',
  total_sessions: 3,
  user_type: 'returning',
  // Audience Data
  cart_value_bucket: 'high',
  engagement_level: 'high',
  // Funnel Context
  funnel_step: 7,
  funnel_stage: 'purchase',
  session_id: 'session_1672531200000_def456',
  timestamp: 1672531200000
}
```

### 3. Implementación Técnica

#### **useEcommerceFunnelTracking Hook**
```typescript
export const useEcommerceFunnelTracking = (cart: CartState) => {
  const { getStoredUTMData } = useUTMTracking();
  const { getUserAcquisitionData } = useUserAcquisitionTracking();
  const { getAudienceData } = useAudienceTracking(cart);

  // Create base event structure with ALL tracking data
  const createBaseEvent = useCallback((
    eventName: string,
    items: Array<...>,
    value: number,
    funnelStep: number,
    funnelStage: string
  ): FunnelEvent => {
    // Automatically combines:
    // - UTM data
    // - User acquisition data
    // - Audience data
    // - Funnel context
    // - Session tracking
  }, [getStoredUTMData, getUserAcquisitionData, getAudienceData]);

  return {
    trackViewItem,
    trackAddToCart,
    trackViewCart,
    trackBeginCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackFunnelStep
  };
};
```

#### **FunnelIntegration Component**
```typescript
export const FunnelIntegration: React.FC<FunnelIntegrationProps> = ({ 
  currentPage, 
  currentItem 
}) => {
  const { cart } = useCartContext();
  const funnelTracking = useEcommerceFunnelTracking(cart);

  useEffect(() => {
    switch (currentPage) {
      case 'tienda':
        if (currentItem) {
          funnelTracking.trackViewItem(currentItem);
          funnelTracking.trackFunnelStep(1, 'awareness');
        }
        break;
      case 'cart':
        if (cart.isOpen && cart.items.length > 0) {
          funnelTracking.trackViewCart();
          funnelTracking.trackFunnelStep(4, 'conversion');
        }
        break;
      case 'checkout':
        if (cart.items.length > 0) {
          funnelTracking.trackBeginCheckout();
          funnelTracking.trackFunnelStep(5, 'conversion');
        }
        break;
      // ... more cases
    }
  }, [currentPage, currentItem, cart]);

  return null; // Tracking-only component
};
```

### 4. Datos Dinámicos Reales

#### **Value Dinámico**
- **view_item**: `item.price` (precio individual)
- **add_to_cart**: `item.price * item.quantity` (subtotal)
- **view_cart**: `cart.total` (total del carrito)
- **begin_checkout**: `cart.total` (total del carrito)
- **add_payment_info**: `cart.total` (total del carrito)
- **purchase**: `checkoutCart.total` (total final)

#### **Items Reales**
- **Siempre usa los datos reales del carrito**
- **Mantiene consistencia entre eventos**
- **Incluye todos los campos requeridos por Google**

#### **Source/Campaign**
- **UTM parameters persisten entre eventos**
- **First touch vs Last touch tracking**
- **Multi-session attribution**

### 5. Ejemplo de Journey Completo

#### **Usuario con UTMs:**
```
URL: https://site.com/?utm_source=google&utm_campaign=spring_sale&utm_medium=cpc

Step 1: view_item
- User visits product page
- Event: view_item with utm_source: 'google'
- Value: 299.99
- Items: 1 product

Step 2: add_to_cart  
- User adds 2x service to cart
- Event: add_to_cart with utm_source: 'google'
- Value: 599.98 (2 * 299.99)
- Items: 2 services

Step 3: view_cart
- User opens cart
- Event: view_cart with utm_source: 'google'
- Value: 599.98
- Items: 2 services

Step 4: begin_checkout
- User starts checkout
- Event: begin_checkout with utm_source: 'google'
- Value: 599.98
- Items: 2 services

Step 5: add_payment_info
- User completes payment form
- Event: add_payment_info with utm_source: 'google'
- Value: 599.98
- Items: 2 services

Step 6: purchase
- User completes purchase
- Event: purchase with utm_source: 'google'
- Value: 599.98
- Transaction ID: ORD-1672531200000
- Items: 2 services
```

### 6. Integración con Google Ads

#### **Enhanced Conversions**
```javascript
// Todos los eventos incluyen user_id para Enhanced Conversions
user_id: 'user_1672531200000_abc123'

// Purchase event con transaction_id para offline conversion import
transaction_id: 'ORD-1672531200000'
```

#### **Audience Building**
```javascript
// Audiencias basadas en funnel progression
high_intent_users: funnel_step >= 3 && cart_value_bucket === 'high'
ready_to_convert: funnel_step === 4 && engagement_level === 'high'
converted_users: funnel_step === 7
```

#### **Bid Adjustments**
```javascript
// Ajustes basados en funnel position
if (funnel_step >= 4) bid_adjustment = '+25%' // High intent
if (cart_value_bucket === 'high') bid_adjustment = '+15%'
if (user_type === 'returning') bid_adjustment = '+10%'
```

### 7. Métricas de Funnel

#### **Conversion Rates por Step**
```javascript
view_item -> add_to_cart: 15%
add_to_cart -> view_cart: 80%
view_cart -> begin_checkout: 60%
begin_checkout -> add_payment_info: 90%
add_payment_info -> purchase: 85%

Overall funnel conversion: 5.5%
```

#### **Funnel Analysis by UTM Source**
```javascript
google_cpc: {
  view_item: 1000,
  add_to_cart: 150,
  purchase: 12,
  conversion_rate: 1.2%
}

facebook_social: {
  view_item: 800,
  add_to_cart: 200,
  purchase: 20,
  conversion_rate: 2.5%
}
```

#### **Revenue Attribution**
```javascript
google_cpc: $3,599.76 revenue (12 purchases * $299.99)
facebook_social: $5,999.80 revenue (20 purchases * $299.99)

ROAS by source:
google_cpc: 3.6x
facebook_social: 4.8x
```

### 8. Testing y Validación

#### **Funnel Testing URLs**
```
# Test complete funnel with UTMs
https://site.com/?utm_source=test&utm_campaign=funnel_test&utm_medium=test

# Expected sequence:
1. Visit product page -> view_item event
2. Add to cart -> add_to_cart event  
3. View cart -> view_cart event
4. Start checkout -> begin_checkout event
5. Complete payment -> add_payment_info event
6. Complete purchase -> purchase event
```

#### **Console Validation**
```javascript
// Check for complete funnel events
dataLayer.filter(event => 
  event.event === 'view_item' || 
  event.event === 'add_to_cart' || 
  event.event === 'view_cart' || 
  event.event === 'begin_checkout' || 
  event.event === 'add_payment_info' || 
  event.event === 'purchase'
)

// Verify UTM consistency
dataLayer.filter(event => event.utm_source === 'test')

// Check user data persistence
dataLayer.filter(event => event.user_id === 'user_xxx')
```

### 9. Best Practices

#### **Data Consistency**
- **Mismo session_id en todos los eventos del funnel**
- **UTM parameters consistentes entre eventos**
- **Items data idénticos entre eventos**
- **Value calculations correctas y dinámicas**

#### **Event Timing**
- **view_item**: Inmediato al cargar página de producto
- **add_to_cart**: Inmediato al añadir al carrito
- **view_cart**: Cuando se abre el carrito
- **begin_checkout**: Al iniciar proceso de checkout
- **add_payment_info**: Cuando se completa formulario de pago
- **purchase**: Al confirmar compra

#### **Error Handling**
```typescript
// Validaciones antes de enviar eventos
if (cart.items.length === 0) return;
if (!currentItem && currentPage === 'tienda') return;
if (!transactionId && eventName === 'purchase') return;
```

## Resumen

**Sistema COMPLETO y CONECTADO:**
- Funnel ecommerce completo con 7 pasos
- UTMs persisten en todos los eventos
- Datos dinámicos reales (value, items)
- User acquisition data integrado
- Audience data enriquecido
- Session tracking consistente
- Integración directa con Google Ads
- Testing tools incluidas

**Este sistema proporciona visibilidad completa del funnel con atribución precisa para optimización de Google Ads!**
