# ADR 001: Visión General y Alcance del Proyecto SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
**SMOLSManager (Social Media OnLine Shop Management)** es una plataforma que permite a vendedores de redes sociales convertir sus publicaciones en una tienda en línea estructurada. El proyecto requiere tres interfaces: una app móvil para compradores, una web global para descubrimiento y una PWA de gestión para vendedores.

El dominio principal es **smolsmanager.com**. La plataforma incluye un **selector de área de venta** donde los vendedores eligen su categoría al registrarse (electronics, repostería, mechanic, computation, etc.), permitiendo a los compradores filtrar tiendas y productos por sector.

## Decisión
El proyecto se divide en cuatro productos principales:
1.  **SMOLSManager Backend:** API REST centralizada.
2.  **SMOLSManager Web:** Sitio público (Next.js) bajo smolsmanager.com.
3.  **SMOLSManager Admin:** PWA de gestión (React).
4.  **SMOLSManager Mobile:** App nativa (React Native).

El MVP se enfoca en la PWA de gestión como producto principal, seguida de la web pública con el selector de categorías funcional.

## Consecuencias
- **Positivo:** Segmentación clara por industria, mejor experiencia de usuario, API robusta.
- **Negativo:** Mayor complejidad en la gestión de categorías y filtros.
