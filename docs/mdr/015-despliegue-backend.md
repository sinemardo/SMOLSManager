# ADR 015: Despliegue del Backend de SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
El backend de SMOLSManager necesita un entorno de producción estable, con variables de entorno seguras y despliegue continuo desde main.

## Decisión
Se elige **Railway** o **Render** para el despliegue del backend.
- **Railway:** Conexión directa con GitHub, despliegue automático al pushear a main.
- **MongoDB Atlas:** Cluster en la misma región (AWS us-east-1 o eu-west-1).
- **Variables de entorno:** MONGO_URI, JWT_SECRET, PORT, SMOLS_DOMAIN=smolsmanager.com.

### CI/CD
- GitHub Actions ejecuta linters y tests en cada push a main.
- Si los tests pasan, el servicio cloud redeploya automáticamente.

## Consecuencias
- **Positivo:** Sin gestión de servidores, escalado automático, bajo coste inicial.
- **Negativo:** Dependencia del proveedor, costes variables con el tráfico.
