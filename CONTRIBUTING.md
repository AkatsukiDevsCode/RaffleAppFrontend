# CONTRIBUTING

¡Gracias por contribuir a este proyecto! Este documento describe las
convenciones que seguimos para mantener un desarrollo organizado y
consistente.

## 📋 Requisitos previos

Antes de comenzar:

- Tener Git instalado.
- Tener el entorno del proyecto configurado.
- Instalar las dependencias.
- Verificar que Husky y Commitlint estén habilitados.

---

# 🌳 Estrategia de ramas

```text
production
└── develop
    ├── feat/<module>-feature
    ├── fix/<module>-bug
    ├── refactor/<module>-task
    └── ...
```

## Ramas principales

### `production`

- Código estable.
- No se permiten pushes directos.
- Solo recibe cambios mediante Pull Request aprobado.

### `develop`

- Rama principal de integración.
- Desde aquí nacen todas las ramas épicas.

## Ramas de trabajo

Formato:

```text
<type>/<module>-short-description
```

Ejemplos:

```text
feat/expenses-budget-form
fix/shared-currency-format
refactor/config-query-client
```

---

# 💬 Convención de commits

Formato obligatorio:

```text
type(scope): imperative description
```

Todo el mensaje debe estar:

- en inglés o español
- en minúsculas
- sin punto final

## Tipos permitidos

Tipo Uso

---

- **feat**: Nueva funcionalidad
- **fix**: Corrección de errores
- **docs**: Documentación
- **style**: Formato
- **refactor**: Refactorización
- **chore**: Mantenimiento

## Scopes permitidos

Scope Carpeta

---

- **expenses**: `src/features/expenses`
- **shared**: `src/shared`
- **config**: `src/config`
- **md**: `.md`
- **root**: Configuración principal
- **ci**: GitHub Actions, Husky, CI

## Ejemplos válidos

```bash
git commit -m "feat(expenses): create budget form component"
git commit -m "fix(shared): resolve currency formatter"
git commit -m "docs(root): update contributing guide"
git commit -m "chore(ci): update commitlint configuration"
```

## Ejemplos inválidos

```text
Actualice el formulario
feat(UI): add button
fix(expenses): Fix bug.
```

---

# 📏 Estándares de Código (ESLint)

Nuestro proyecto usa **ESLint** para mantener la consistencia. Algunas reglas clave a recordar:

- **Rutas absolutas:** Están estrictamente prohibidas las rutas relativas (`../`, `./`). Todas las importaciones deben ser absolutas y comenzar con `src/` (ej. `import Button from "src/shared/ui/Button"`).
- **Tipado estricto:** El tipo de retorno de las funciones es obligatorio, a excepción de las capas de presentación (`src/**/presentation/**` y `src/shared/ui/**`), donde los componentes de React pueden inferirlo libremente.
- **Aislamiento de Capas:** La capa de `Domain` no puede importar de `Infrastructure` ni `Presentation`. `Application` solo interactúa con `Domain`.

---

# 📝 Convención de Pull Requests

El título del PR debe resumir la característica principal usando la convención `tipo[(scope_opcional)]: descripción`.
El tipo es obligatorio (`feat`, `fix`, `chore`, etc.) y el scope es opcional si el cambio abarca múltiples módulos.

---

# 🔀 Flujo de trabajo

1.  Actualizar la rama de desarrollo.

```bash
git checkout develop
git pull origin develop
```

2.  Crear una rama nueva.

```bash
git checkout -b feat/expenses-modal
```

3.  Desarrollar la funcionalidad.

4.  Crear commits siguiendo el estándar.

```bash
git commit -m "feat(expenses): add expense modal"
```

5.  Subir la rama.

```bash
git push origin feat/expenses-modal
```

6.  Abrir un Pull Request hacia la rama de desarrollo (`develop`).

---

# ✅ Checklist antes del Pull Request

- [ ] El proyecto compila correctamente.
- [ ] No existen errores de lint.
- [ ] Los commits siguen el formato establecido.
- [ ] La rama sigue la convención de nombres.
- [ ] Se eliminaron archivos temporales.
- [ ] Se actualizó la documentación si era necesario.

---

# 🚫 Errores comunes

- Hacer push directamente a `production`.
- Crear ramas fuera de una rama épica.
- Utilizar nombres con espacios o mayúsculas.
- Utilizar scopes no permitidos.

---

# 📖 Ejemplo completo

```bash
git checkout develop
git pull origin develop

git checkout -b feat/expenses-budget-form

# desarrollar...

git add .
git commit -m "feat(expenses): create budget form"

git push origin feat/expenses-budget-form

# abrir Pull Request:
# feat/expenses-budget-form -> develop
```

Gracias por ayudar a mantener el proyecto limpio, consistente y fácil de
mantener.
