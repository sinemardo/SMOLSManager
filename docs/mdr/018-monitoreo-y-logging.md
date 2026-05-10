# ADR 018: Monitoreo y Logging en SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
Además de los logs de actividad, necesitamos health checks y alertas para SMOLSManager.

## Decisión
- **Health Check:** Endpoint /health (público) verifica MongoDB y estado del servidor.
- **UptimeRobot:** Monitoreo externo cada 5 minutos sobre smolsmanager.com/health.
- **Alertas:** Winston + Slack Webhook para errores nivel error.
- **Logs de acceso:** Morgan captura peticiones entrantes.

## Consecuencias
- **Positivo:** Detección temprana de caídas, trazabilidad.
- **Negativo:** Dependencia de Slack para alertas.
