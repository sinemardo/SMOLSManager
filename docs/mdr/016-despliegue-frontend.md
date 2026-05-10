# ADR 016: Despliegue de Frontends de SMOLSManager (Web y PWA)

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
La web (smolsmanager.com) y la PWA de SMOLSManager necesitan despliegue rápido, CDN global y SSL automático.

## Decisión
- **Web (Next.js):** Se despliega en **Vercel** con dominio personalizado smolsmanager.com.
- **PWA (React + Vite):** Se despliega en **Netlify** (subdominio dmin.smolsmanager.com).
- Ambas plataformas ofrecen SSL, CDN y despliegue continuo desde Git.

## Consecuencias
- **Positivo:** Configuración mínima, HTTPS automático, preview deployments.
- **Negativo:** Límites de ancho de banda en planes gratuitos.
