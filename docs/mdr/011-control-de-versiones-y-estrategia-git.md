# ADR 011: Control de Versiones y Estrategia Git de SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
SMOLSManager es un monorepo con múltiples artefactos (backend, web, pwa, mobile). Necesitamos una estrategia clara para gestionar ramas, commits y versiones.

## Decisión
Se adopta **Git** con la filosofía **Trunk-Based Development** simplificada.
- **Rama main:** Código siempre estable y desplegable.
- **Ramas de feature:** eat/<nombre> (cortas, < 2 días de trabajo).
- **Commits convencionales:** eat:, ix:, docs:, chore:, efactor:.
- **Versionado semántico:** MAJOR.MINOR.PATCH (ej. 1.2.0).
- **Tags:** Cada release se etiqueta con su versión (ej. 1.0.0).

## Consecuencias
- **Positivo:** Historial limpio, fácil de automatizar con CI/CD, integración fluida de cambios.
- **Negativo:** Requiere disciplina en mensajes de commit y ramas de vida corta.
