# ADR 006: Autenticación y Autorización en SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
Los vendedores (PWA) y compradores (web/móvil) de SMOLSManager necesitan identificar sus sesiones de forma segura.

## Decisión
Se implementa **JWT (JSON Web Tokens)** para autenticación.

- Registro y login local (email + password hasheada con bcrypt).
- Tokens de acceso con expiración corta (1 hora) y refresh tokens (7 días).
- Roles: user, seller, dmin.
- Durante el registro, el vendedor selecciona su categoría de venta (electronics, repostería, mechanic, computation, etc.).

## Consecuencias
- **Positivo:** Stateless, escalable, simple de implementar en APIs REST.
- **Negativo:** Revocación de tokens más compleja (se gestiona con lista negra en Redis si fuera necesario).
