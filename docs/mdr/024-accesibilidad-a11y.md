# ADR 024: Accesibilidad (A11y)

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
SMOLSManager debe ser usable por personas con discapacidades. WCAG 2.1 Nivel AA es el estandar objetivo.

## Decision
Se implementan las siguientes medidas:

### Navegacion por teclado
- Todos los elementos interactivos son focusables
- Orden de tabulacion logico (izq-der, arriba-abajo)
- Focus visible (anillo de 2px color indigo)
- Atajos de teclado: Ctrl+Enter para enviar formularios

### Lectores de pantalla
- Atributos ARIA en componentes custom
- Labels descriptivos en inputs (no solo placeholder)
- Texto alternativo en todas las imagenes
- Roles semanticos en tablas y listas

### Contraste y color
- Contraste minimo 4.5:1 para texto normal
- Contraste minimo 3:1 para texto grande
- Nunca usar solo color para transmitir informacion (incluir iconos/texto)
- Modo de alto contraste opcional

### Estado vacio y errores
- Mensajes de error descriptivos (no "Error generico")
- Sugerencias de solucion en mensajes de error
- Confirmacion de exito con descripcion de lo que ocurrio

## Consecuencias
- **Positivo:** Inclusivo, legalmente compliant, mejor SEO
- **Negativo:** Tiempo extra de desarrollo (+20% estimado)
