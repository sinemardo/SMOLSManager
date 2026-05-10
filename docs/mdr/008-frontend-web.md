# ADR 008: Frontend Web Global de SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
El sitio público de SMOLSManager (smolsmanager.com) debe ser rápido, indexable por motores de búsqueda (SEO) y atractivo para los compradores que descubren productos. Debe incluir un **selector de categorías** visible para filtrar por área de venta (electronics, repostería, mechanic, computation, etc.).

## Decisión
Se elige **Next.js** (React) con **SSR (Server Side Rendering)**.
- **Next.js:** Hidratación en servidor, generación estática y rutas API opcionales.
- **Tailwind CSS** para estilado rápido.
- **Vercel** para despliegue (origen del framework) bajo el dominio smolsmanager.com.
- El selector de categorías se implementa como componente reutilizable.

## Consecuencias
- **Positivo:** Excelente SEO, rendimiento percibido alto, ecosistema React maduro.
- **Negativo:** Curva de aprendizaje de Next.js si no se conoce, dependencia de Vercel (mitigable exportando estático).
