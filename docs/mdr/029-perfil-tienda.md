# ADR 029: Perfil de Tienda Personalizable

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

## Contexto
Cada vendedor necesita una página de perfil que muestre su marca, aumente la confianza del comprador y permita personalización básica.

## Decisión
Se crea un panel de "Mi Tienda" con:

### Secciones
1. **Cabecera**: Foto de portada, logo, nombre de tienda, categoría
2. **Información**: Descripción, ubicación, redes sociales vinculadas
3. **Vista previa**: Simulación de cómo ve el comprador la tienda
4. **Métricas**: Productos activos, ventas totales, seguidores

### Funcionalidades
- Subida de logo (imagen)
- Edición de nombre, descripción, categoría
- Vinculación de cuentas de redes sociales
- Previsualización en tiempo real

### Diseño
- Diseño de dos columnas: formulario a la izquierda, vista previa a la derecha
- Foto de portada con efecto parallax
- Indicadores de completitud del perfil (barra de progreso)

## Consecuencias
- **Positivo:** Mayor personalización, branding del vendedor, confianza del comprador
- **Negativo:** Requiere almacenamiento de imágenes (CDN/Cloudinary en el futuro)
