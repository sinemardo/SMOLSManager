# ADR 021: Sistema de Diseño y Componentes

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
Necesitamos una biblioteca de componentes reutilizables para mantener consistencia entre PWA, Web y Mobile.

## Decision
Se define el siguiente sistema de diseño:

### Paleta de colores
| Token | Color | Uso |
|:---|:---|:---|
| Primary | #4f46e5 (Indigo 600) | Botones principales, enlaces, marca |
| Primary Dark | #4338ca (Indigo 700) | Hover states |
| Success | #059669 (Green 600) | Estados positivos |
| Warning | #d97706 (Amber 600) | Alertas |
| Error | #dc2626 (Red 600) | Errores |
| Gray 50-900 | Escala Tailwind | Fondos, texto, bordes |

### Tipografia
- **Titulos**: Inter, pesos 600-700
- **Cuerpo**: Inter, pesos 400-500
- **Codigo**: JetBrains Mono (solo en documentacion)

### Componentes base
| Componente | PWA | Web | Mobile |
|:---|:---|:---|:---|
| Button | React | Next.js | React Native |
| Input | Tailwind | Tailwind | TextInput |
| Card | Tailwind | Tailwind | View |
| Modal | Headless UI | Custom | Modal RN |
| Toast | React Hot Toast | Sonner | Snackbar |
| Table | Custom | Custom | FlatList |
| Chart | Recharts | Recharts | Chart Kit |

## Consecuencias
- **Positivo:** Desarrollo mas rapido, consistencia visual garantizada
- **Negativo:** Limitacion creativa, dependencia de librerias externas
