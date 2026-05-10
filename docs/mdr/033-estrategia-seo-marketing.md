# ADR 033: Estrategia de SEO y Marketing Digital

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
La web pública de SMOLSManager necesita ser indexable y atraer tráfico orgánico para los vendedores.

## Decisión
Se implementan las siguientes estrategias:

### SEO On-Page (Web Pública - Next.js)
- **Meta tags dinámicos**: title, description, og:image por producto
- **Sitemap.xml**: Generado automáticamente con todas las URLs
- **Robots.txt**: Configuración de rastreo
- **Schema.org**: Product, Organization, BreadcrumbList
- **URLs amigables**: /productos/{slug} en lugar de /products/{id}
- **Optimización de imágenes**: Next/Image con lazy loading, WebP

### SEO para Vendedores
- Perfil de tienda indexable: /tienda/{storeName}
- Productos indexables individualmente
- Metadatos personalizables por vendedor

### Analytics de Marketing
- Google Analytics 4 (o Plausible para privacidad)
- Eventos: page_view, product_view, post_import, order_created
- Dashboard de marketing en panel admin

### Estrategia de Contenido
- Blog integrado en /blog (fase 2)
- Guías para vendedores: "Cómo vender desde Instagram"
- Casos de éxito de vendedores

## Consecuencias
- **Positivo:** Mayor visibilidad, tráfico orgánico, mejor experiencia de vendedores
- **Negativo:** Mantenimiento de contenido, dependencia de herramientas externas
