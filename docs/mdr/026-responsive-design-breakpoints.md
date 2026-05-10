# ADR 026: Responsive Design y Breakpoints

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
SMOLSManager debe funcionar en dispositivos desde 320px hasta 2560px de ancho.

## Decision
Se adoptan los breakpoints de Tailwind CSS como estandar:

| Breakpoint | Ancho | Dispositivo |
|:---|:---|:---|
| sm | 640px | Movil horizontal |
| md | 768px | Tablet |
| lg | 1024px | Laptop pequeña |
| xl | 1280px | Desktop |
| 2xl | 1536px | Desktop grande |

### Reglas de diseño responsive
1. **PWA Admin**: Sidebar colapsa en < 768px, tabla se convierte en cards
2. **Web Publica**: Grid de 1 columna (movil) -> 2 cols (tablet) -> 3-4 cols (desktop)
3. **Dashboard KPIs**: 1 columna (movil) -> 2 cols (tablet) -> 4 cols (desktop)
4. **Formularios**: Ancho completo en movil, max-width 480px en desktop
5. **Navegacion**: Bottom tab bar en movil, sidebar en desktop

### Imagenes y assets
- Imagenes responsivas con srcset (Web) o resize (API)
- Iconos SVG siempre (nunca PNG)
- Lazy loading para imagenes fuera de viewport

## Consecuencias
- **Positivo:** Experiencia optima en cualquier dispositivo
- **Negativo:** Desarrollo y testing mas complejos
