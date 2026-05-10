# ADR 009: PWA de Gestión de SMOLSManager (Vendedores)

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
Los vendedores de SMOLSManager necesitan gestionar su tienda desde cualquier dispositivo (escritorio, tablet, móvil), incluso con conectividad limitada. Durante el registro, deben seleccionar su área de venta (electronics, repostería, mechanic, computation, etc.).

## Decisión
Se desarrolla una **PWA** con **React** y **Vite**.
- **React + TypeScript:** Componentes reutilizables y tipado seguro.
- **Vite:** Build tool rápido para desarrollo.
- **Workbox:** Service worker para soporte offline y caché de assets.
- **Selector de categorías:** Componente principal en el flujo de registro y configuración de tienda.

## Consecuencias
- **Positivo:** Instalable como app nativa, acceso offline parcial, sin pasar por tiendas de apps.
- **Negativo:** Limitaciones de acceso a hardware del dispositivo, almacenamiento local limitado.
