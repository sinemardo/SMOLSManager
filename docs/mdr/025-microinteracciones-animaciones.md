# ADR 025: Microinteracciones y Animaciones

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
Las microinteracciones mejoran la percepcion de calidad y guian al usuario.

## Decision
Se implementan las siguientes microinteracciones:

### Acciones del sistema
| Interaccion | Animacion | Duracion |
|:---|:---|:---|
| Click en boton | Escala 0.97 + rebote | 150ms |
| Hover en card | Elevacion (shadow) + escala 1.02 | 200ms |
| Carga de datos | Skeleton loader con shimmer | Indefinido |
| Exito (crear producto) | Confetti + toast verde | 3s |
| Error | Shake horizontal + toast rojo | 500ms |
| Eliminar | Fade out + slide up | 300ms |
| Transicion de pagina | Fade in | 200ms |

### Estados de carga
- **Skeleton loader**: Placeholder animado con forma similar al contenido
- **Spinner**: Solo para acciones menores a 2 segundos
- **Progress bar**: Para importacion y conversion de posts
- **Empty state**: Ilustracion + texto + CTA (nunca pantalla en blanco)

### Notificaciones
- **Toast**: Esquina superior derecha, autodesaparece en 5s
- **Notificacion push**: Solo para eventos criticos (nueva orden)
- **Badge**: Contador en icono de campana (WebSocket)

## Consecuencias
- **Positivo:** Experiencia pulida, feedback claro, percepcion de velocidad
- **Negativo:** Abuso de animaciones puede molestar (respetar prefers-reduced-motion)
