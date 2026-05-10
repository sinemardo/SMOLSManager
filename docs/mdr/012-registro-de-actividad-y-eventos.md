# ADR 012: Registro de Actividad y Eventos en SMOLSManager

- **Estado:** Aceptado
- **Fecha:** 2026-05-10
- **Decisores:** GregoryFranco

---

## Contexto
En SMOLSManager debemos auditar las acciones de los usuarios (vendedores y compradores) para el dashboard de KPIs y para depuración de errores. También es necesario un sistema de eventos para comunicación desacoplada entre módulos.

## Decisión
Se implementa un sistema de **Logging de Actividad** y un **Event Emitter** interno.

### Logging de Actividad
- **Formato:** JSON estructurado.
- **Librería:** Winston (Node.js).
- **Almacenamiento:** Archivos diarios en /var/log/smolsmanager (producción) y salida a consola (desarrollo).
- **Qué se registra:** Acciones de usuario (login, crear producto, delete, selección de categoría), errores de API, accesos no autorizados.
- **Niveles:** info, warn, error.

### Eventos (EventEmitter)
- Uso del módulo nativo events de Node.js para desacoplar notificaciones (ej: order:created -> notificar por email y actualizar dashboard).
- **MongoDB** como store intermedio para eventos críticos que necesiten replay (colección events).

## Consecuencias
- **Positivo:** Auditoría completa, fácil de agregar métricas, desacoplamiento de lógica de negocio.
- **Negativo:** Los logs pueden crecer rápido (necesitan rotación), el EventEmitter es en memoria (no sobrevive a reinicio si no se persiste).
