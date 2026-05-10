# ADR 014: Dashboard en Cascada de SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
El vendedor de SMOLSManager necesita una vista "en cascada" (funnel) que le muestre el flujo de sus publicaciones desde que se registran hasta que generan una venta, con filtro por categoría.

## Decisión
Se implementa un **Dashboard en Cascada** con los siguientes niveles (de arriba hacia abajo):

1.  **Publicaciones Importadas:** Total de posts registrados desde redes sociales.
2.  **Productos Activos por Categoría:** Posts convertidos en productos, agrupados por área de venta.
3.  **Visitantes al Producto:** Vistas únicas (evento product:viewed).
4.  **Carritos Iniciados:** Eventos cart:item_added.
5.  **Órdenes Completadas:** Compras finalizadas.

- **Interfaz:** Gráfico de barras horizontales (Recharts) con selector de categoría.
- **Actualización:** Diaria, desde colección events a unnel_daily.

## Consecuencias
- **Positivo:** Visibilidad total del funnel, segmentación por industria.
- **Negativo:** Dependencia de registro de eventos en frontend.
