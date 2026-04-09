# Funnel Completo de Ecommerce - Google Ads & GA4

## Eventos Implementados (Orden del Funnel)

### 1. view_item 
**Cuándo:** Usuario ve un producto/servicio
**Dónde:** `HomePage.tsx` - `handleServiceProductView()`
```javascript
window.dataLayer.push({
  event: 'view_item',
  ecommerce: {
    items: [{
      item_name: 'Consultoría SEO',
      item_id: 'serv-a',
      price: 299.99,
      item_category: 'Servicios',
      item_variant: 'service'
    }]
  }
});
```

### 2. select_item
**Cuándo:** Usuario selecciona un producto/servicio
**Dónde:** `HomePage.tsx` - `handleServiceProductSelect()`
```javascript
window.dataLayer.push({
  event: 'select_item',
  ecommerce: {
    items: [{ ...item details... }]
  }
});
```

### 3. add_to_cart
**Cuándo:** Usuario añade producto al carrito
**Dónde:** `useCart.ts` - `addToCart()`
```javascript
window.dataLayer.push({
  event: 'add_to_cart',
  ecommerce: {
    currency: 'USD',
    value: 299.99,
    items: [{ ...item details... }]
  }
});
```

### 4. view_cart
**Cuándo:** Usuario abre el carrito
**Dónde:** `Cart.tsx` - `useEffect()`
```javascript
window.dataLayer.push({
  event: 'view_cart',
  ecommerce: {
    currency: 'USD',
    value: 599.98,
    items: [{ ...item details... }]
  }
});
```

### 5. begin_checkout
**Cuándo:** Usuario inicia el proceso de checkout
**Dónde:** `CheckoutPage.tsx` - `useEffect()`
```javascript
window.dataLayer.push({
  event: 'begin_checkout',
  ecommerce: {
    currency: 'USD',
    value: 599.98,
    items: [{ ...item details... }]
  }
});
```

### 6. add_payment_info
**Cuándo:** Usuario completa información de pago
**Dónde:** `useCheckout.ts` - `updatePaymentInfo()`
```javascript
window.dataLayer.push({
  event: 'add_payment_info',
  ecommerce: {
    currency: 'USD',
    value: 599.98,
    items: [{ ...item details... }]
  },
  payment_type: 'credit_card'
});
```

### 7. purchase
**Cuándo:** Usuario completa la compra
**Dónde:** `CheckoutSuccess.tsx` - `useEffect()`
```javascript
window.dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'ORD-1672531200000',
    value: 599.98,
    currency: 'USD',
    items: [{ ...item details... }]
  },
  utm_source: 'google',
  utm_campaign: 'spring_sale',
  utm_medium: 'cpc'
});
```

## Eventos Adicionales

### remove_from_cart
**Cuándo:** Usuario elimina producto del carrito
**Dónde:** `useCart.ts` - `removeFromCart()`

### update_cart
**Cuándo:** Usuario cambia cantidad de producto
**Dónde:** `useCart.ts` - `updateQuantity()`

### utm_captured
**Cuándo:** Usuario llega con parámetros UTM
**Dónde:** `useUTMTracking.ts` - `captureUTMParameters()`

### cart_restored
**Cuándo:** Usuario retorna con carrito persistente
**Dónde:** `useCart.ts` - `useEffect()`

## Flujo Completo del Usuario

```
1. Usuario llega con UTM (utm_captured)
   |
2. Ve productos (view_item)
   |
3. Selecciona producto (select_item)
   |
4. Añade al carrito (add_to_cart)
   |
5. Abre carrito (view_cart)
   |
6. Inicia checkout (begin_checkout)
   |
7. Completa info de pago (add_payment_info)
   |
8. Completa compra (purchase con UTM attribution)
```

## Datos Clave para Google Ads

- **conversion_value:** Monto total de la compra
- **transaction_id:** ID único de transacción
- **currency:** Moneda (USD)
- **items:** Detalles completos de productos
- **utm_*:** Atribución de campaña
- **payment_type:** Tipo de pago

## Testing del Funnel

### URLs de Prueba con UTM:
```
https://tu-site.com/?utm_source=google&utm_campaign=test1&utm_medium=cpc
https://tu-site.com/?utm_source=facebook&utm_campaign=spring_sale&utm_medium=social
https://tu-site.com/?utm_source=email&utm_campaign=newsletter&utm_medium=email
```

### Pasos para Testing:
1. Visitar sitio con UTM parameters
2. Navegar a productos
3. Añadir productos al carrito
4. Abrir carrito
5. Iniciar checkout
6. Completar información de envío
7. Completar información de pago
8. Finalizar compra

## Métricas para Google Ads

- **Conversion Rate:** purchases / sessions
- **Cart Abandonment Rate:** begin_checkout / add_to_cart
- **Payment Abandonment Rate:** purchase / add_payment_info
- **Average Order Value:** total value / purchases
- **Campaign ROI:** revenue / campaign spend

Este funnel completo proporciona todos los datos necesarios para que el algoritmo de Google Ads optimice las campañas automáticamente.
