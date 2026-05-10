# ADR 013: KPIs y Métricas de SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
Necesitamos medir el éxito de SMOLSManager y proveer datos agregados al dashboard en cascada.

## Decisión
Se definen las siguientes categorías de KPIs, calculadas a partir de los logs de actividad y las colecciones de MongoDB:

### KPIs de Negocio (para Dashboard)
| KPI | Fuente | Frecuencia |
|:---|:---|:---|
| Productos Creados por Día | Colección products | Diaria |
| Productos por Categoría | Colección categories | Diaria |
| Órdenes Creadas | Colección orders | Diaria |
| Tasa de Conversión | orders / visits (requiere registro de visitas) | Semanal |
| Vendedores Activos por Categoría | Colección users con rol seller | Mensual |
| Ingresos Brutos | Suma de 	otal en orders completadas | Mensual |

### KPIs Técnicos (para monitoreo)
| KPI | Herramienta |
|:---|:---|
| Latencia de API (p95) | Winston + Health Check |
| Tasa de Errores | Winston (nivel error) |
| Uso de CPU/Memoria | Métricas de Railway/Render |

### Método de Cálculo
Se usarán **tareas programadas** (node-cron) que agreguen los KPIs en colecciones separadas (kpis_daily, kpis_weekly) para consulta rápida desde el dashboard.

## Consecuencias
- **Positivo:** Métricas accionables, datos históricos, base para el dashboard en cascada.
- **Negativo:** Sobrecarga de procesamiento en horas de baja actividad (mitigable con colas).
