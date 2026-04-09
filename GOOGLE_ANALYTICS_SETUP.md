# Google Analytics Setup

## Overview

Se ha integrado Google Analytics (GA4) con el Measurement ID `G-Y4SLRC5R4Z` en todas las páginas del proyecto para tracking completo de eventos y conversiones.

## Components

### GoogleAnalytics Component

**Location:** `src/components/GoogleAnalytics.tsx`

**Features:**
- Automatic script loading from Google Tag Manager
- Configuration with custom Measurement ID
- React Helmet integration for proper meta tags
- TypeScript support with full type safety

**Usage:**
```tsx
import { GoogleAnalytics } from './components/GoogleAnalytics';

// Default Measurement ID
<GoogleAnalytics />

// Custom Measurement ID
<GoogleAnalytics measurementId="G-CUSTOM_ID" />
```

### SEO Component Enhanced

**Location:** `src/components/SEO.tsx`

**Features:**
- React Helmet async for dynamic meta tags
- Open Graph tags for social sharing
- Twitter Card optimization
- Canonical URL generation
- Robots meta tags
- Custom keywords and author

**Usage:**
```tsx
import { SEO } from './components/SEO';

<SEO 
  title="Page Title"
  desc="Page description for SEO"
  canonical="/custom-path"
/>
```

## Implementation Details

### Global Tracking

**App.tsx Integration:**
```tsx
import { GoogleAnalytics } from './components/GoogleAnalytics';

return (
    <Router basename="/ads-tests">
        <GoogleAnalytics />
        <Navigation />
        <Routes>
            {/* Routes */}
        </Routes>
    </Router>
);
```

### Page-Level SEO

**SuccessPage.tsx Example:**
```tsx
import { SEO } from '../components/SEO';

export const SuccessPage: React.FC = () => {
    return (
        <div>
            <SEO 
                title="Éxito | Registro Completado" 
                desc="Página de agradecimiento del laboratorio" 
            />
            {/* Page Content */}
        </div>
    );
};
```

## Google Analytics Features

### Automatic Events

The setup automatically tracks:

1. **Page Views** - Every route change
2. **Ecommerce Events** - All funnel events
3. **UTM Parameters** - Campaign tracking
4. **User Acquisition** - First/last touch
5. **Audience Data** - User segmentation
6. **Attribution Models** - Multi-touch analysis

### Enhanced Ecommerce Tracking

**Events Tracked:**
- `view_item` - Product views
- `add_to_cart` - Cart additions
- `view_cart` - Cart views
- `begin_checkout` - Checkout start
- `add_payment_info` - Payment info
- `purchase` - Completed purchases

### Custom Dimensions

**User-Level Dimensions:**
- `user_type` - new/returning/engaged
- `first_source` - Initial acquisition source
- `last_source` - Last touch source
- `touch_count` - Total user touches

### Conversion Tracking

**Enhanced Conversions:**
```javascript
// Automatic enhanced conversion data
gtag('event', 'purchase', {
  'transaction_id': 'order_12345',
  'value': 99.99,
  'currency': 'USD',
  'user_id': 'user_1672531200000_abc123',
  'first_source': 'google',
  'last_source': 'direct',
  'items': [
    {
      'item_id': 'product_1',
      'item_name': 'Analytics Service',
      'category': 'service',
      'quantity': 1,
      'price': 99.99
    }
  ]
});
```

## Configuration

### Measurement ID

**Current ID:** `G-Y4SLRC5R4Z`

**To Change:**
1. Update `GoogleAnalytics.tsx` default prop
2. Update `.env` file with new ID
3. Redeploy application

### Environment Variables

**Optional .env setup:**
```env
VITE_GA_MEASUREMENT_ID=G-Y4SLRC5R4Z
```

**Component with Environment Variable:**
```tsx
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-Y4SLRC5R4Z';
<GoogleAnalytics measurementId={measurementId} />
```

## Privacy & Compliance

### Consent Mode Integration

The setup respects Google Consent Mode:

```javascript
// Consent Mode is automatically initialized
gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
});

// Updated when user accepts cookies
gtag('consent', 'update', {
    'ad_storage': 'granted',
    'analytics_storage': 'granted'
});
```

### GDPR Compliance

- **Cookie Consent** - Integrated with CookieConsent component
- **Data Minimization** - Only essential data collected
- **User Control** - Consent management
- **Transparency** - Clear data collection notices

## Testing & Verification

### Local Testing

**Check GA Integration:**
1. Open Developer Tools
2. Network tab → Filter by `google-analytics`
3. Verify `gtag.js` script loads
4. Check `config` event fires
5. Confirm Measurement ID is correct

### Debug Mode

**Enable Debug Mode:**
```javascript
// Add to GoogleAnalytics component
gtag('config', measurementId, {
  debug_mode: true
});
```

### Real-Time Verification

**Steps:**
1. Deploy to production
2. Visit Google Analytics → Real-Time
3. Navigate through site
4. Verify events appear in real-time
5. Check user acquisition data

## Production Deployment

### Build Verification

The build includes:
- ✅ Google Analytics script injection
- ✅ SEO meta tags optimization
- ✅ Open Graph social sharing
- ✅ Twitter Card support
- ✅ Canonical URL generation
- ✅ Enhanced ecommerce events

### Deploy Checklist

**Before Deploy:**
- [ ] Google Analytics Measurement ID verified
- [ ] SEO titles and descriptions set
- [ ] Open Graph images optimized
- [ ] Canonical URLs correct
- [ ] Consent mode configured

**After Deploy:**
- [ ] Real-time events tracking
- [ ] Conversion data flowing
- [ ] Enhanced ecommerce working
- [ ] Audience segmentation active
- [ ] Attribution models calculating

## Advanced Features

### Custom Event Tracking

**Example Custom Events:**
```tsx
const trackCustomEvent = () => {
    if (window.gtag) {
        window.gtag('event', 'custom_event', {
            'event_category': 'engagement',
            'event_label': 'button_click',
            'value': 1
        });
    }
};
```

### Ecommerce Enhancement

**Product-Level Tracking:**
```tsx
const trackProductView = (product: Product) => {
    window.gtag('event', 'view_item', {
        'items': [{
            'item_id': product.id,
            'item_name': product.name,
            'category': product.category,
            'price': product.price,
            'quantity': 1
        }]
    });
};
```

## Support & Troubleshooting

### Common Issues

**Events Not Appearing:**
1. Check Measurement ID is correct
2. Verify ad-blocker is disabled
3. Confirm consent mode allows analytics
4. Check browser console for errors

**SEO Tags Missing:**
1. Verify Helmet component is rendering
2. Check React Helmet async setup
3. Confirm meta tags in page source
4. Validate Open Graph tags

### Debug Information

**Browser Console:**
```javascript
// Check GA configuration
console.log('GA Measurement ID:', window.google_tag_data?.config?.[0]?.[2]);

// Verify dataLayer
console.log('GA DataLayer:', window.dataLayer);

// Check gtag function
console.log('GA gtag:', typeof window.gtag);
```

## Best Practices

### Performance

- ✅ **Async Loading** - Non-blocking script load
- ✅ **Cache Optimization** - Efficient data transmission
- ✅ **Minimal Impact** - Fast page loads
- ✅ **Error Handling** - Graceful failures

### SEO Optimization

- ✅ **Unique Titles** - Every page has unique title
- ✅ **Meta Descriptions** - Compelling descriptions
- ✅ **Open Graph** - Social sharing optimization
- ✅ **Canonical URLs** - Duplicate content prevention
- ✅ **Structured Data** - Search engine understanding

This setup provides comprehensive Google Analytics integration with full ecommerce tracking, SEO optimization, and privacy compliance.
