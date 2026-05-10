# ADR 019: Cumplimiento Legal y Privacidad de Datos en SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
SMOLSManager debe cumplir con GDPR y LOPD si maneja datos de ciudadanos europeos.

## Decisión
- **Datos mínimos:** Email, nombre de tienda y categoría de venta.
- **Consentimiento:** Checkbox de términos en registro.
- **Derecho al olvido:** DELETE /api/v1/users/me.
- **Cookies:** Solo técnicas (JWT); aviso en la web.
- **Propiedad:** Los vendedores son dueños de sus productos. SMOLSManager no reclama propiedad.

## Consecuencias
- **Positivo:** Buenas prácticas desde el inicio.
- **Negativo:** Requiere aviso legal profesional (coste).
