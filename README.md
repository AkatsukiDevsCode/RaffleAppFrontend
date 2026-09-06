# 👨‍💻 Control de gastos personales

Aplicación web para el control de gastos personales. Desarrollada con React, TypeScript y Vite bajo Clean Architecture.

---

## Requisitos Previos

- Es **estrictamente necesario** tener instalado [pnpm](https://pnpm.io/) en tu sistema para la gestión de dependencias.

- **IMPORTANTE:** Para poder realizar contribuciones al proyecto, es **indispensable** leer el archivo [CONTRIBUTING.md](CONTRIBUTING.md) para conocer las convenciones del proyecto.
- En caso de que necesites informacion adicional acerca de los commits y las ramas, leer el archivo [Guia-Contribucion-Branches-Commits.md](Guia-Contribucion-Branches-Commits.md).

## 🚀 Instalación y Ejecución

1. Instala las dependencias del proyecto:

    ```bash
    pnpm install
    ```

    > **Nota sobre Git Hooks:** Dado que `pnpm` en algunos entornos puede omitir la instalación de los hooks de Husky, es **necesario** inicializarlos manualmente la primera vez ejecutando:
    >
    > ```bash
    > pnpm run prepare
    > ```

2. Inicia el servidor de desarrollo:

    ```bash
    pnpm run dev
    ```

---

## 🛡️ Validaciones y Calidad de Código

Este proyecto asegura la calidad del código mediante **ESLint** (para mantener un estándar consistente) y **Husky** (hooks de Git integrados que validan tu código antes de permitir realizar commits o pushes).

Puedes auditar el proyecto de forma manual ejecutando los siguientes scripts con `pnpm`:

1. **Verificación de Tipos (TypeScript)**
    - `typecheck`: Compila y busca errores de tipado en todo el proyecto.
    - `typecheck:logs:linux` / `typecheck:logs:windows`: Guarda los errores de TypeScript en un archivo `tsc.logs` (muy útil cuando hay demasiados errores para leer en la terminal).
2. **Análisis Estático y Estructura**
    - `lint`: Ejecuta ESLint para reportar problemas de sintaxis o estilo de código.
    - `lint:fs`: Verifica con `ls-lint` que los nombres de archivos y carpetas cumplan las convenciones (kebab-case).
    - `lint:deps`: Valida con `dependency-cruiser` que se respeten las reglas de dependencias de la Clean Architecture.
    - `lint:knip`: Audita con `knip` el proyecto detectando código muerto o dependencias sin uso.

```bash
# Ejemplos de uso:
pnpm run typecheck
pnpm run lint:deps
```

## ⚙️ Configuración de `.vscode`

El proyecto esta fuertemente ligado a la configuración de [ESLint](https://eslint.org/) y [Prettier](https://prettier.io/), por lo que es **altamente recomendable** crear de forma local el archivo `.vscode/settings.json` en la raíz del proyecto y agregarle la siguiente configuración. Esto permitirá que tu editor se integre perfectamente, formateando y reparando problemas de estilo de forma automática al guardar.

```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 4,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },

    "eslint.workingDirectories": [{ "mode": "auto" }],
    "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

Para que esta configuración funcione correctamente, asegúrate de tener instaladas las siguientes extensiones oficiales en tu editor:

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)
