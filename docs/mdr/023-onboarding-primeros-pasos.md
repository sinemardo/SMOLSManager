# ADR 023: Onboarding y Primeros Pasos

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
Los nuevos vendedores necesitan entender rapidamente el valor de SMOLSManager y completar su primera importacion.

## Decision
Se implementa un sistema de onboarding progresivo:

### Paso 1: Registro simplificado (30 segundos)
- Solo email, password y nombre de tienda
- Seleccion de categoria principal
- Sin verificacion de email en MVP

### Paso 2: Dashboard con estado vacio
- Mensaje: "Importa tu primer post de Instagram"
- Boton CTA principal: "Importar Post"
- Video tutorial embedido de 60 segundos
- 3 cards con beneficios principales

### Paso 3: Tooltips guiados
- Primera visita al dashboard: tooltip en boton "Importar"
- Primer post importado: tooltip en "Convertir a producto"
- Primer producto creado: tooltip en "Ver en tienda publica"

### Paso 4: Checklist de activacion
- [ ] Importar primer post
- [ ] Convertir a producto
- [ ] Completar perfil de tienda
- [ ] Compartir enlace de tienda

## Consecuencias
- **Positivo:** Usuarios alcanzan valor en menos de 5 minutos
- **Negativo:** Tooltips pueden ser molestos para usuarios avanzados (incluir opcion "No mostrar mas")
