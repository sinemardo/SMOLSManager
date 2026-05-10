# ADR 032: Estrategia de Testing

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
SMOLSManager necesita una estrategia de testing para garantizar calidad en backend, frontend y mobile.

## Decisión
Se adopta la pirámide de testing:

### Testing por capas
| Capa | Herramienta | Cobertura objetivo |
|:---|:---|:---|
| Unit Tests | Jest + React Testing Library | 80% |
| Integration Tests | Supertest (API) + Jest | 70% |
| E2E Tests | Playwright | Flujos críticos |
| Mobile Tests | React Native Testing Library | 60% |

### Unit Tests (Backend)
- Controladores: auth, products, orders, categories, social
- Servicios: validación, utilidades
- Middleware: auth, error handler, rate limiter

### Integration Tests (API)
- Registro y login
- CRUD de productos
- Flujo de importación de posts
- Cambio de estados de órdenes

### E2E Tests (Playwright)
- Login completo
- Dashboard carga KPIs
- Importar post → Convertir a producto
- Crear orden → Cambiar estado

### CI/CD
- GitHub Actions ejecuta tests en cada push
- Tests fallidos bloquean el merge
- Reporte de cobertura con Codecov

## Consecuencias
- **Positivo:** Código fiable, deploys seguros, detección temprana de bugs
- **Negativo:** Tiempo de desarrollo inicial +30%, mantenimiento de tests
