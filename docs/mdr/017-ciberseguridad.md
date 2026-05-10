# ADR 017: Ciberseguridad en SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
SMOLSManager maneja datos personales (email) y transacciones. Es obligatorio protegerla contra amenazas comunes según OWASP Top 10.

## Decisión
Se implementan las siguientes medidas de seguridad:

### Lista de Verificación OWASP (Principales)
| Amenaza | Mitigación |
|:---|:---|
| **Inyección (SQL/NoSQL)** | Mongoose sanitiza queries; validación estricta con Joi/Zod. |
| **Autenticación Rota** | bcrypt para passwords, JWT con expiración, refresh tokens rotativos. |
| **Exposición de Datos Sensibles** | HTTPS forzado (HSTS), datos sensibles nunca en logs. |
| **Cross-Site Scripting (XSS)** | React escapa por defecto; CSP en headers. |
| **Control de Acceso Roto** | Middleware equireRole('seller') en cada endpoint. |

### Políticas Adicionales
- **CORS:** Solo dominios autorizados (smolsmanager.com, dmin.smolsmanager.com).
- **Rate Limiting:** 100 peticiones/minuto por IP.
- **Helmet:** Seguridad en headers HTTP.
- **CSRF:** Doble cookie de envío para la PWA.

## Consecuencias
- **Positivo:** Plataforma robusta frente a ataques comunes.
- **Negativo:** Configuración inicial más compleja.
