# ADR 035: Gestión de Errores y Resiliencia

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
SMOLSManager debe ser resiliente ante fallos de base de datos, APIs externas y errores de usuario.

## Decisión
Se implementan las siguientes estrategias:

### Manejo de errores por capa
| Capa | Estrategia | Ejemplo |
|:---|:---|:---|
| API Routes | Try/catch con next(error) | Controladores |
| Middleware | Error handler global | errorHandler.js |
| Frontend | Error boundaries | React Error Boundary |
| BD | Retry con exponential backoff | Prisma retry |
| APIs externas | Circuit breaker | 5 fallos = abierto 30s |

### Circuit Breaker (APIs Externas)
- Instagram API: 5 fallos → circuito abierto 30 segundos
- TikTok API: 3 fallos → circuito abierto 60 segundos
- Fallback: Datos simulados mientras el circuito está abierto

### Retry Policy
- Operaciones críticas: 3 reintentos con backoff exponencial
- Timeout máximo: 10 segundos por operación
- No reintentar en errores 4xx (cliente)

### Health Checks
- Endpoint /health: Verifica BD, Redis (futuro), APIs externas
- UptimeRobot: Monitoreo cada 1 minuto
- Alertas: Slack/Email cuando el health check falla

### Recuperación de desastres
- Backups diarios de PostgreSQL (Neon automático)
- Backup de código en GitHub
- Plan de rollback: revertir a commit anterior en < 5 minutos

## Consecuencias
- **Positivo:** Sistema robusto, tiempo de caída mínimo, confianza del usuario
- **Negativo:** Complejidad adicional en el código, falsos positivos en circuit breaker
