# Checkout Error Tracking - CRO Level

## Sistema Completo de Tracking de Errores

### Evento Principal: `checkout_error`

```javascript
{
  event: 'checkout_error',
  checkout_step: 'shipping' | 'payment' | 'confirmation',
  error_type: 'validation' | 'payment' | 'shipping' | 'technical',
  error_message: 'Este campo es obligatorio',
  field_name: 'email',
  cart_value: 299.99,
  cart_items_count: 2,
  user_agent: 'Mozilla/5.0...',
  timestamp: '2024-01-15T10:30:00.000Z',
  page_path: '/checkout'
}
```

## Tipos de Errores Trackeados

### 1. Validation Errors (error_type: 'validation')
**Cuándo:** Usuario completa campo incorrectamente
**Campos trackeados:**
- `firstName` - Nombre inválido
- `lastName` - Apellido inválido  
- `email` - Email inválido
- `phone` - Teléfono inválido
- `address` - Dirección inválida
- `city` - Ciudad inválida
- `zipCode` - Código postal inválido
- `cardNumber` - Número de tarjeta inválido
- `cardHolder` - Titular inválido
- `expiryDate` - Fecha expiración inválida
- `cvv` - CVV inválido

### 2. Payment Errors (error_type: 'payment')
**Cuándo:** Error en procesamiento de pago
**Ejemplos:**
- Tarjeta declinada
- Fondos insuficientes
- Error de conexión con payment processor

### 3. Shipping Errors (error_type: 'shipping')
**Cuándo:** Error en cálculo de envío
**Ejemplos:**
- Dirección no válida
- Servicio de envío no disponible
- Costo de envío no calculable

### 4. Technical Errors (error_type: 'technical')
**Cuándo:** Error técnico del sistema
**Ejemplos:**
- Error de conexión
- Timeout del servidor
- Error inesperado del sistema

## Implementación Técnica

### 1. ShippingForm.tsx
```typescript
const handleBlur = (field: keyof ShippingInfo) => {
    setTouched(prev => new Set(prev).add(field));
    const error = validateField(field, shippingInfo[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
    
    // Track validation errors
    if (error && touched.has(field)) {
        trackCheckoutError({
            checkout_step: 'shipping',
            error_type: 'validation',
            error_message: error,
            field_name: field,
            cart_value: cart.total,
            cart_items_count: cart.items.length,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    }
};
```

### 2. PaymentForm.tsx
```typescript
const handleBlur = (field: keyof PaymentInfo) => {
    setTouched(prev => new Set(prev).add(field));
    if (field !== 'saveCard') {
        const error = validateField(field, paymentInfo[field]);
        setErrors(prev => ({ ...prev, [field]: error }));
        
        // Track validation errors
        if (error && touched.has(field)) {
            trackCheckoutError({
                checkout_step: 'payment',
                error_type: 'validation',
                error_message: error,
                field_name: field,
                cart_value: cart.total,
                cart_items_count: cart.items.length,
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });
        }
    }
};
```

### 3. useErrorTracking Hook
```typescript
export const useErrorTracking = (): ((errorData: CheckoutErrorData) => void) => {
    const trackCheckoutError = (errorData: CheckoutErrorData): void => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'checkout_error',
            ...errorData
        });
        
        console.error('?? Checkout Error:', errorData);
    };

    return trackCheckoutError;
};
```

## Métricas CRO que se Pueden Calcular

### 1. Error Rate por Paso
```javascript
// Shipping step errors
shipping_error_rate = shipping_errors / shipping_step_views

// Payment step errors  
payment_error_rate = payment_errors / payment_step_views

// Overall checkout error rate
checkout_error_rate = total_errors / total_checkout_sessions
```

### 2. Error Rate por Campo
```javascript
email_error_rate = email_errors / email_field_interactions
card_number_error_rate = card_number_errors / card_number_field_interactions
```

### 3. Abandono por Error
```javascript
abandonment_after_error = sessions_with_errors_that_abandoned / total_sessions_with_errors
```

### 4. Valor de Carrito Afectado
```javascript
avg_cart_value_with_errors = sum(cart_value_with_errors) / count(errors)
revenue_lost_to_errors = sum(cart_value_of_abandoned_with_errors)
```

## Acciones de Optimización Basadas en Datos

### 1. High Error Fields
**Si `email` tiene 30% error rate:**
- Agregar validación en tiempo real
- Mostrar ejemplos de formato correcto
- Autocompletar desde user data

### 2. Step Bottlenecks  
**Si `payment` step tiene 50% error rate:**
- Simplificar formulario de pago
- Agregar múltiples payment methods
- Mejorar mensajes de error

### 3. High Value Cart Errors
**Si carros > $500 tienen más errores:**
- Asistencia personalizada
- Validación más estricta upfront
- Checkout dedicado para high-value

### 4. Device-Specific Errors
**Si mobile tiene 2x error rate:**
- Optimizar para mobile
- Simplificar campos
- Autocompletar cuando sea posible

## Ejemplos de Eventos Reales

### Email Validation Error
```javascript
{
  event: 'checkout_error',
  checkout_step: 'shipping',
  error_type: 'validation',
  error_message: 'Email inválido',
  field_name: 'email',
  cart_value: 299.99,
  cart_items_count: 2,
  user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

### Card Number Error
```javascript
{
  event: 'checkout_error',
  checkout_step: 'payment',
  error_type: 'validation',
  error_message: 'Número de tarjeta inválido',
  field_name: 'cardNumber',
  cart_value: 599.99,
  cart_items_count: 3,
  user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  timestamp: '2024-01-15T10:35:00.000Z'
}
```

## Integración con Google Ads

### 1. Remarketing por Error
```javascript
// Usuario que abandonó por error de tarjeta
if (error_type === 'payment' && field_name === 'cardNumber') {
  // Mostrar ads sobre "Múltiples métodos de pago"
  // Ofrecer ayuda con payment process
}
```

### 2. Bid Adjustments
```javascript
// Reducir bids para usuarios con alta tasa de errores
if (user_error_rate > 0.3) {
  // Adjust bid down - user needs help, not more ads
}
```

### 3. Custom Audiences
```javascript
// Audiencia de usuarios con errores de validación
checkout_validation_errors_audience = users_with_validation_errors

// Target con creatives de ayuda y soporte
```

Este sistema de error tracking proporciona datos completos para optimización CRO a nivel profesional.
