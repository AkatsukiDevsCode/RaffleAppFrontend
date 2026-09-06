# Estructura del Proyecto

Este documento describe la estructura de alto nivel del repositorio, el cual incluye tanto el código fuente de la aplicación frontend (React)

## Vista General

El proyecto se divide principalmente en dos grandes bloques:

- `src/features`: Módulos de la aplicación, cada feature.
- `src/shared`: Recursos compartidos por toda la app.

---

## Aplicación Frontend

La carpeta `src/` sigue un enfoque de **Clean Architecture** estructurado mediante **Feature-Sliced Design**, buscando máxima escalabilidad e independencia.

```text
src/
├── App.tsx                    # Componente raíz
├── main.tsx                   # Punto de entrada de React
├── config/                    # Configuraciones globales (ej. TanStack Query)
├── features/                  # Módulos de la aplicación (ej. expenses, budget)
│   └── [nombre-feature]/      # Cada feature es totalmente independiente
│       ├── core/              # Lógica de Negocio (Domain, Application, Infrastructure, DI)
│       └── presentation/      # Lógica Visual (Components, Hooks, React Context)
└── shared/                    # Recursos compartidos por toda la app
    ├── core/                  # Adaptadores genéricos (ej. UUID, Intl), helpers, errores;
                                     archivos compartidos que no usen dependencias de react
    └── presentation/                    # Componentes visuales genéricos y agnósticos
```

_Para profundizar en cómo interactúan las capas dentro de cada feature, revisa la documentación de la [Arquitectura](architecture)._

---
