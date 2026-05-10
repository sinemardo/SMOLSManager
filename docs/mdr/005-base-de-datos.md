# ADR 005: Base de Datos de SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
En SMOLSManager, los productos pueden tener atributos variables según la categoría (electronics, repostería, mechanic, computation, etc.). Un esquema rígido (SQL) complica la iteración rápida en la fase MVP.

## Decisión
Se elige **MongoDB** con **Mongoose** como ODM.

- **MongoDB Atlas** como servicio cloud (escalado automático, backups).
- **Mongoose** para modelado de datos con esquemas flexibles.
- La colección categories almacenará las áreas de venta (electronics, repostería, mechanic, computation, etc.).

## Consecuencias
- **Positivo:** Modelos de datos flexibles, buena integración con Node.js, escalado horizontal sencillo.
- **Negativo:** Sin transacciones multi-documento garantizadas (aunque MongoDB 4.0+ las soporta), anidamiento excesivo puede degradar rendimiento.
