# ADR 028: Catálogo de Productos (Vista Vendedor)

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
El vendedor necesita gestionar visualmente todos sus productos desde un panel centralizado. Actualmente solo existe la gestión de posts importados.

## Decisión
Se crea un panel de "Catálogo de Productos" con las siguientes características:

### Funcionalidades
1. **Vista de tarjetas**: Grid responsive con imagen, nombre, precio, categoría, estado
2. **Filtros**: Por categoría, estado (activo/inactivo), búsqueda por texto
3. **Acciones rápidas**: Editar, duplicar, activar/desactivar, eliminar
4. **Vista previa rápida**: Modal con detalles del producto
5. **Estadísticas individuales**: Vistas, conversiones, clics

### Diseño
- Grid de 4 columnas en desktop, 2 en tablet, 1 en móvil
- Imagen principal con overlay hover (precio y estado)
- Badges de colores para categorías
- Botones de acción con iconos (lápiz, ojo, basura)

## Consecuencias
- **Positivo:** Control total sobre el inventario, flujo de trabajo optimizado
- **Negativo:** Carga inicial si hay muchos productos (paginación necesaria)
