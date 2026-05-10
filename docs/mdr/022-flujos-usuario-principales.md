# ADR 022: Flujos de Usuario Principales

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
SMOLSManager tiene 2 tipos de usuarios con flujos distintos: Vendedores (PWA) y Compradores (Web/Mobile).

## Decision
Se definen los siguientes flujos principales:

### Flujo del Vendedor (PWA)
1. **Onboarding**: Login -> Seleccionar categoria -> Ver dashboard vacio -> CTA para importar
2. **Importacion**: Click "Importar" -> Seleccionar plataforma -> Pegar URL -> Preview -> Confirmar
3. **Conversion**: Ver post importado -> Click "Convertir" -> Asignar precio/nombre/categoria -> Confirmar
4. **Gestion**: Dashboard -> Ver metricas -> Gestionar posts/productos -> Ver ordenes

### Flujo del Comprador (Web/Mobile)
1. **Descubrimiento**: Landing -> Ver categorias -> Filtrar por interes
2. **Exploracion**: Scroll productos -> Ver detalle -> Ver seller info
3. **Compra** (futuro): Seleccionar producto -> Carrito -> Checkout

### Principios de cada flujo
- Maximo 3 pasos para completar cualquier tarea
- Barra de progreso para tareas multi-paso
- Boton "Deshacer" disponible 5 segundos despues de cada accion
- Confirmacion para acciones destructivas (eliminar)

## Consecuencias
- **Positivo:** Flujos optimizados, menos abandono, mayor conversion
- **Negativo:** Limitacion en funcionalidades avanzadas que requieran mas pasos
