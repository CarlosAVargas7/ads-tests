# ADS Tests - Ecommerce Funnel Tracking System

Sistema completo de tracking de funnel ecommerce con UTMs, atribución multi-touch, y segmentación avanzada de audiencias para Google Ads.

## Features

- **UTM Tracking**: Captura y persistencia de parámetros UTM
- **User Acquisition Tracking**: First touch vs Last touch attribution
- **Audience Segmentation**: Segmentación avanzada de audiencias
- **Attribution Models**: 5 modelos de atribución multi-touch
- **Ecommerce Funnel**: Tracking completo del funnel de conversión
- **Google Ads Integration**: Enhanced Conversions y custom audiences

## Development Tools

El proyecto incluye 4 herramientas de desarrollo (comentadas para producción):

- **UTMTester**: Testing de parámetros UTM
- **AudienceTester**: Segmentación de audiencias
- **UserAcquisitionTester**: Tracking de adquisición
- **AttributionModelTester**: Modelos de atribución GOD Level

## Deployment

### GitHub Pages

Este proyecto está configurado para despliegue automático en GitHub Pages mediante GitHub Actions.

#### Configuración Automática

1. **Habilitar GitHub Pages**:
   - Ve a tu repositorio en GitHub
   - Settings > Pages
   - Source: "GitHub Actions"

2. **Permisos necesarios**:
   - Settings > Actions > General
   - Workflow permissions: "Read and write permissions"
   - Allow GitHub Actions to create and approve pull requests

#### Flujo de Despliegue

El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente:

- **On push to main**: Build y deploy a GitHub Pages
- **On pull request**: Build only (no deploy)

#### URL de Producción

```
https://[username].github.io/ads-tests/
```

### Manual Deployment

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Preview build
pnpm preview
```

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/username/ads-tests.git
cd ads-tests

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development Tools

Para activar las herramientas de desarrollo, descomenta en `src/App.tsx`:

```tsx
// Descomentar importaciones
import { UTMTester } from './components/UTMTester';
import { AudienceTester } from './components/AudienceTester';
import { UserAcquisitionTester } from './components/UserAcquisitionTester';
import { AttributionModelTester } from './components/AttributionModelTester';

// Descomentar componentes
<UTMTester />
<AudienceTester />
<UserAcquisitionTester />
<AttributionModelTester />
```

### Testing URLs

```bash
# UTM Testing
https://[username].github.io/ads-tests/?utm_source=google&utm_campaign=test&utm_medium=cpc

# Multi-touch journey simulation
# Use AttributionModelTester to simulate complete user journeys
```

## Architecture

### Core Hooks

- `useUTMTracking`: Captura y persistencia de UTMs
- `useUserAcquisitionTracking`: First/last touch tracking
- `useAudienceTracking`: Segmentación de audiencias
- `useAttributionModel`: Modelos de atribución multi-touch
- `useEcommerceFunnelTracking`: Funnel ecommerce completo

### Components

- `UTMTester`: Testing de parámetros UTM
- `AudienceTester`: Visualización de audiencias
- `UserAcquisitionTester`: Tracking de adquisición
- `AttributionModelTester`: Modelos de atribución

### Data Flow

```
UTM Parameters
    |
    v
User Acquisition Tracking
    |
    v
Audience Segmentation
    |
    v
Ecommerce Funnel Events
    |
    v
Attribution Models
    |
    v
Google Ads Integration
```

## Google Analytics & Google Ads

### Event Tracking

El sistema implementa eventos GA4 completos:

- `view_item`
- `add_to_cart`
- `view_cart`
- `begin_checkout`
- `add_payment_info`
- `purchase`

### Enhanced Conversions

```javascript
// Enhanced Conversions data
user_id: 'user_1672531200000_abc123'
first_source: 'google'
last_source: 'direct'
touch_count: 4
```

### Custom Audiences

```javascript
// Audiencias personalizadas
high_value_users: cart_value_bucket === 'high'
multi_touch_users: touch_count > 2
engaged_users: engagement_level === 'high'
```

## Environment Variables

```env
# Google Analytics (opcional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Ads (opcional)
VITE_GAW_CONVERSION_ID=AW-XXXXXXXXXX
```

## Contributing

1. Fork el repositorio
2. Crear feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Submit Pull Request

## License

MIT License - ver archivo LICENSE para detalles.

## Support

Para soporte o preguntas:

- Issues en GitHub
- Documentation en los archivos .md del proyecto
- Development tools para testing y debugging
