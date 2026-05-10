# ADR 003: Estilo Arquitectónico de SMOLSManager (Monolito Modular vs. Microservicios)

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
El proyecto SMOLSManager está en fase MVP con recursos limitados. Necesitamos un estilo que permita iterar rápido sin comprometer la escalabilidad futura.

## Decisión
Se elige un **Monolito Modular** para el backend.

- Todo el código reside en un solo proyecto (/backend), pero se organiza en módulos independientes: uth, users, categories, products, orders.
- Cada módulo tiene sus propias rutas, controladores, servicios y modelos.

## Consecuencias
- **Positivo:** Desarrollo más rápido, menor complejidad operacional, fácil de desplegar.
- **Negativo:** Acoplamiento en la base de código; migrar a microservicios en el futuro requerirá refactorización.
