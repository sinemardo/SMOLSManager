# 🧱 Guía de Canonicidad, Orden y Escalabilidad
## Magic Flavors Co

Este documento define las **reglas estructurales y organizativas** del proyecto Magic Flavors Co.  
Su objetivo es garantizar un código **ordenado**, **canónico**, **mantenible** y **escalable** a largo plazo, independientemente del tamaño del equipo o del crecimiento del sistema.

---

## 🎯 Objetivos de esta guía

- Mantener una estructura clara y predecible
- Evitar duplicación y desorden de archivos
- Facilitar el crecimiento del proyecto
- Asegurar consistencia entre frontend, backend y futuras plataformas
- Permitir que nuevos desarrolladores entiendan el proyecto rápidamente

---

## 🧠 Principio de canonicidad

**Canonicidad** significa que:

> Cada archivo tiene un único propósito claro  
> Cada tipo de lógica vive en un solo lugar  
> No existen múltiples formas de hacer lo mismo

### Reglas básicas
- Un archivo = una responsabilidad
- Una carpeta = un dominio funcional
- Nada “genérico” fuera de su carpeta correspondiente
- Si dudas dónde va algo → está mal ubicado

---

## 🧱 Estructura canónica del proyecto