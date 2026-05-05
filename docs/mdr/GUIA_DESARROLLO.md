# 🛠️ Guía de Desarrollo
## Magic Flavors Co

Este documento está orientado a desarrolladores que trabajen o colaboren en el proyecto.

---

## 📁 Estructura del backend

---

## 🎨 Editor visual

El editor es el núcleo de la plataforma.

### Características
- Basado en canvas
- Uso de Konva / React-Konva
- Elementos arrastrables
- Guardado de diseños en formato JSON

### Ejemplo de diseño

```json
{
  "type": "tarta",
  "elements": [
    {
      "id": 1,
      "type": "text",
      "value": "Feliz Cumpleaños",
      "x": 120,
      "y": 60
    }
  ]
}
