# ADR 027: Copywriting y Tono de Voz

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
El texto en la interfaz debe ser claro, util y reflejar la personalidad de SMOLSManager.

## Decision
Se define el siguiente tono de voz:

### Personalidad
- **Profesional pero cercano**: Usamos "tu" en español, no "usted"
- **Positivo**: Mensajes de exito con entusiasmo
- **Util**: Cada mensaje ayuda al usuario a avanzar
- **Breve**: Mensajes de maximo 2 lineas en toast, 3 en modales

### Ejemplos
| Contexto | ❌ No | ✅ Si |
|:---|:---|:---|
| Exito al crear | Producto creado | ¡Listo! Tu producto ya esta en la tienda |
| Error de login | Error de autenticacion | Email o contrasena incorrectos. ¿Los revisamos? |
| Estado vacio | No hay productos | Aun no tienes productos. ¡Importa tu primer post! |
| Eliminar | Esta seguro? | ¿Eliminar este producto? Podras recuperarlo en 30 dias |
| Carga | Loading... | Preparando tu dashboard... |

### Terminologia consistente
- "Tienda" (no "shop" ni "store")
- "Post" (no "publicacion" ni "contenido")
- "Vendedor" (no "seller" ni "merchant")
- "Comprador" (no "buyer" ni "cliente")

## Consecuencias
- **Positivo:** Experiencia mas humana, mejor comprension
- **Negativo:** Requiere revision de copywriter, traducciones futuras mas costosas
