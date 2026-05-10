# ADR 034: Plan de Escalabilidad

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
SMOLSManager debe estar preparado para escalar desde 10 vendedores a 10,000 sin cambios drásticos de arquitectura.

## Decisión
Se define un plan de escalabilidad en 3 fases:

### Fase 1: MVP (Actual - < 100 vendedores)
- Monolito modular en Node.js/Express
- PostgreSQL (Neon) serverless
- Vercel para frontends
- Sin caché (consultas directas a BD)

### Fase 2: Crecimiento (100 - 1,000 vendedores)
- **Caché Redis**: Para consultas frecuentes (categorías, KPIs)
- **CDN Cloudflare**: Para assets estáticos e imágenes
- **Cola de trabajos BullMQ**: Para importación de posts y emails
- **Índices optimizados**: Revisión de queries lentas

### Fase 3: Escala (1,000 - 10,000 vendedores)
- **Microservicios**: Separar auth, products, orders, social
- **Message Queue**: RabbitMQ o Kafka para comunicación entre servicios
- **Read Replicas**: PostgreSQL read replicas
- **Search Engine**: Elasticsearch para búsqueda de productos
- **Sharding**: Por tenant (vendedor) si es necesario

### Principios de escalabilidad
1. **Stateless**: Backend no guarda estado en memoria
2. **Asíncrono**: Tareas pesadas en background jobs
3. **Monitorización**: Alertas de uso de CPU, memoria, DB
4. **Auto-scaling**: Railway/Vercel escala automáticamente

## Consecuencias
- **Positivo:** Preparado para crecimiento, sin refactorizaciones traumáticas
- **Negativo:** Complejidad incremental, costes de infraestructura
