# ADR 031: Integracion APIs Redes Sociales

- **Estado:** Propuesto (Pendiente de API Keys)
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
SMOLSManager necesita obtener datos reales de posts de redes sociales para mostrar metricas precisas.

## APIs Requeridas

### Instagram Graph API
- URL: https://developers.facebook.com/docs/instagram-api
- Tipo: Gratuito
- Registro: https://developers.facebook.com
- Requiere: Crear app, obtener Access Token

### TikTok API
- URL: https://developers.tiktok.com
- Tipo: Creditos gratuitos ( iniciales)
- Registro: https://developers.tiktok.com
- Requiere: Crear app, Client Key + Client Secret

## Variables de entorno pendientes
INSTAGRAM_ACCESS_TOKEN=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=

## Estado
- [ ] Instagram API Key
- [ ] TikTok API Key
- [ ] Variables configuradas
- [ ] Servicio implementado
