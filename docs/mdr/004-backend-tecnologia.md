# ADR 004: Tecnología del Backend de SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
El backend de SMOLSManager necesita un ecosistema maduro, gran disponibilidad de paquetes y un rendimiento aceptable para operaciones I/O intensivas.

## Decisión
Se elige **Node.js** con el framework **Express.js**.

- **Node.js:** Entorno de ejecución JavaScript asíncrono.
- **Express.js:** Framework minimalista para construir APIs REST.
- **TypeScript** se añadirá en la Fase 2 para mayor seguridad de tipos.

## Consecuencias
- **Positivo:** Mismo lenguaje (JavaScript) en frontend y backend, enorme ecosistema npm, alta concurrencia.
- **Negativo:** Single-threaded; operaciones CPU-intensivas pueden bloquear el event loop (mitigable con workers).
