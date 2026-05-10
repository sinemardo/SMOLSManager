# ADR 030: Panel de Gestión de Órdenes

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
El vendedor necesita ver y gestionar los pedidos que recibe, cambiar estados y comunicarse con compradores.

## Decisión
Se crea un panel de "Órdenes" con:

### Funcionalidades
1. **Lista de órdenes**: Tabla con fecha, comprador, total, estado
2. **Filtros**: Por estado (pendiente, confirmado, enviado, entregado, cancelado)
3. **Detalle de orden**: Modal/slide con productos comprados, dirección, notas
4. **Cambio de estado**: Botones para avanzar el estado (pendiente → confirmado → enviado → entregado)
5. **Contador**: Badge con órdenes pendientes

### Diseño
- Tabla responsiva (columnas principales en móvil, detalle expandible)
- Badges de colores para estados:
  - Pendiente: amarillo
  - Confirmado: azul
  - Enviado: naranja
  - Entregado: verde
  - Cancelado: rojo
- Timeline visual de estados

## Consecuencias
- **Positivo:** Flujo de trabajo claro, trazabilidad de pedidos
- **Negativo:** Necesita notificaciones push para nuevas órdenes (WebSocket ya implementado)
