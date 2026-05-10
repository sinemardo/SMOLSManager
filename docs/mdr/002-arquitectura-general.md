# ADR 002: Arquitectura General del Sistema SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
Necesitamos un diseño que comunique los tres frontends con un único backend, garantizando seguridad, rendimiento y escalabilidad para SMOLSManager bajo el dominio smolsmanager.com.

## Decisión
Se adopta un modelo **Cliente-Servidor** con una **API REST** como único punto de entrada a los datos.

- Los clientes (Web, PWA, Móvil) se comunican con el backend mediante peticiones HTTP/HTTPS autenticadas con JWT.
- El backend expone una API REST documentada con Swagger.
- Se utiliza un API Gateway simple (Express) para enrutar peticiones y manejar CORS.

## Consecuencias
- **Positivo:** Separación clara de responsabilidades, facilita el desarrollo en paralelo.
- **Negativo:** La API REST puede no ser óptima para funcionalidades en tiempo real (futuro).
