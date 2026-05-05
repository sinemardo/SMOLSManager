# 📊 Guía de KPIs
## Magic Flavors Co

Este documento define los **Indicadores Clave de Rendimiento (KPIs)** del proyecto Magic Flavors Co.  
Su objetivo es medir el desempeño del producto, el crecimiento de usuarios, la eficiencia operativa y la sostenibilidad del negocio.

---

## 🎯 Objetivos de los KPIs

- Medir el crecimiento y adopción de la plataforma
- Evaluar el uso del editor visual
- Analizar la conversión de usuarios
- Controlar la calidad del servicio
- Apoyar la toma de decisiones estratégicas

---

## 🧱 Clasificación de KPIs

Los KPIs se agrupan en las siguientes categorías:

1. KPIs de Producto
2. KPIs de Usuarios
3. KPIs de Negocio
4. KPIs Técnicos
5. KPIs de Contenido
6. KPIs de Seguridad y Administración

---

## 🎨 1. KPIs de Producto (Editor)

Miden el uso y valor del editor visual.

| KPI | Descripción |
|----|------------|
| Diseños creados | Número total de diseños creados |
| Diseños guardados | Diseños almacenados correctamente |
| Diseños exportados | Exportaciones (imagen/PDF) |
| Tiempo promedio en editor | Minutos por sesión |
| Elementos por diseño | Promedio de objetos usados |
| Plantillas usadas | Uso de plantillas existentes |

---

## 👥 2. KPIs de Usuarios

Evalúan el crecimiento y comportamiento de los usuarios.

| KPI | Descripción |
|----|------------|
| Usuarios registrados | Total de cuentas creadas |
| Usuarios activos diarios (DAU) | Usuarios activos por día |
| Usuarios activos mensuales (MAU) | Usuarios activos por mes |
| Retención 7 / 30 días | Usuarios que regresan |
| Usuarios por rol | Free / Premium / Proveedor |
| Conversión Free → Premium | Porcentaje de mejora |

---

## 💰 3. KPIs de Negocio

Relacionados con monetización y sostenibilidad.

| KPI | Descripción |
|----|------------|
| Ingresos mensuales | Total facturado |
| Tasa de conversión | Free a Premium |
| Cancelaciones | Bajas de suscripción |
| Ingresos por proveedor | Ventas de servicios |
| ARPU | Ingreso promedio por usuario |
| LTV | Valor del cliente en el tiempo |

---

## ⚙️ 4. KPIs Técnicos

Miden estabilidad y rendimiento del sistema.

| KPI | Descripción |
|----|------------|
| Disponibilidad (uptime) | % de tiempo activo |
| Tiempo de respuesta API | Promedio en ms |
| Errores 4xx / 5xx | Fallos por periodo |
| Uso de CPU / memoria | Consumo del servidor |
| Tiempo de carga frontend | First Contentful Paint |

---

## 📦 5. KPIs de Contenido

Enfocados en plantillas y recursos gráficos.

| KPI | Descripción |
|----|------------|
| Plantillas creadas | Total disponibles |
| Plantillas más usadas | Ranking |
| Recursos gráficos usados | Stickers, formas |
| Diseños públicos | Compartidos |
| Reportes de contenido | Moderación |

---

## 🔐 6. KPIs de Seguridad y Administración

Supervisión del control del sistema.

| KPI | Descripción |
|----|------------|
| Intentos fallidos de login | Seguridad |
| Usuarios bloqueados | Moderación |
| Acciones de admin | Auditoría |
| Cambios de rol | Trazabilidad |
| Incidentes reportados | Seguridad |

---

## 👑 KPIs por Rol

### SuperAdmin
- KPIs globales
- Salud del sistema
- Ingresos totales
- Crecimiento general

### Admin
- Moderación
- Contenido
- Conversión
- Actividad de usuarios

### Usuario
- Uso del editor
- Diseños creados
- Exportaciones
- Actividad personal

---

## 🛠️ Implementación técnica

- Los KPIs se calculan desde la base de datos
- Se exponen vía API protegida
- Se visualizan en dashboards
- Se actualizan por eventos y jobs programados

---

## 📈 Visualización recomendada

- Gráficas de líneas (crecimiento)
- Barras (comparaciones)
- KPI cards (valores clave)
- Filtros por fecha y rol

---

## ✅ Buenas prácticas

- Medir solo lo relevante
- Revisar KPIs periódicamente
- Ajustar según evolución del producto
- No sobrecargar dashboards

---

## 📌 Nota final

Los KPIs son una herramienta viva.  
Deben evolucionar junto al producto y las necesidades del negocio.