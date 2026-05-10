# ADR 020: Principios de Diseño UX

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
SMOLSManager necesita una experiencia de usuario coherente en sus 3 productos (PWA, Web, Mobile). Los vendedores deben completar tareas rápidas de gestión y los compradores deben descubrir productos fácilmente.

## Decision
Se adoptan los siguientes principios de diseño:

1. **Mobile First**: Todas las interfaces se diseñan primero para movil ( 375px) y escalan a desktop
2. **Jerarquia visual clara**: Acciones primarias destacadas, contenido secundario con menos peso visual
3. **Feedback inmediato**: Cada accion del usuario recibe respuesta en menos de 200ms
4. **Progresion gradual**: Funcionalidades avanzadas ocultas hasta que el usuario las necesite
5. **Consistencia cross-platform**: Mismos patrones en PWA, Web y Mobile

## Consecuencias
- **Positivo:** Experiencia unificada, menor friccion, usuarios mas satisfechos
- **Negativo:** Mayor esfuerzo de diseño inicial, pruebas en mas dispositivos
