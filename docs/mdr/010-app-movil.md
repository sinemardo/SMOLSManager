# ADR 010: App Móvil de SMOLSManager para Compradores

- **Estado:** Propuesto
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
Los compradores de SMOLSManager esperan una experiencia móvil fluida, con notificaciones push, filtro por categorías y acceso a cámara para futuros features (ej: escanear QR).

## Decisión
Se propone **React Native** para el desarrollo de la app iOS/Android.
- Código base compartido (~90%).
- Misma tecnología (React) que la PWA y la Web, facilitando el desarrollo.
- Implementación de selector de categorías nativo.

## Consecuencias
- **Positivo:** Desarrollo rápido multiplataforma, gran comunidad, Hot Reload.
- **Negativo:** Rendimiento inferior a nativo puro en animaciones complejas, dependencia de librerías de terceros para características nativas.

**Nota:** Esta decisión está en estado "Propuesto" porque la app móvil se desarrollará en la Fase 2 del MVP.
