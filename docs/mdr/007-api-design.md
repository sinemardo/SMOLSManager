# ADR 007: Diseño de la API de SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
La API de SMOLSManager debe ser predecible, versionable y fácil de documentar para facilitar el desarrollo frontend en paralelo.

## Decisión
Se adopta un estilo **RESTful** con lineamientos estrictos.
- **Versionado en la URL:** /api/v1/...
- **Colecciones en plural:** GET /api/v1/products, GET /api/v1/categories
- **Códigos HTTP semánticos:** 200, 201, 400, 401, 404, 500.
- **Documentación:** Swagger (OpenAPI 3.0) generada con swagger-jsdoc.
- **Endpoint de categorías:** GET /api/v1/categories devuelve la lista de áreas de venta (electronics, repostería, mechanic, computation, etc.).

## Consecuencias
- **Positivo:** Estándar industrial, predecible, fácil de consumir desde cualquier frontend.
- **Negativo:** Overfetching/underfetching en algunos endpoints (mitigable con campos ields en query).
