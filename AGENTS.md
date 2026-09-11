# AGENTS.md

## Inicio rápido

```bash
pnpm install
pnpm run prepare   # inicializar hooks de Husky (pnpm a veces los omite)
```

## Comandos de verificación (ejecutar en este orden)

```bash
pnpm run lint:fs       # ls-lint: nombres de archivos/carpetas (kebab-case + sufijos)
pnpm run lint          # ESLint
pnpm run typecheck     # tsc -b (incremental)
```

No hay framework de tests instalado. No crear archivos de test a menos que el usuario lo pida.

**CI** (`ci-pr.yml`) ejecuta: `ls-lint` → `pnpm lint` → `pnpm run typecheck`. Knip solo corre en PRs contra `production`.

## Gestor de paquetes

Solo pnpm (estricto). Nunca usar npm, yarn o bun. Engine: Node 22.

## Arquitectura: Clean Architecture + Feature-Sliced Design

Todo el código vive bajo `src/`. Dos módulos de nivel superior:

- `src/shared/` — código transversal (utils, componentes UI, routing, errores)
- `src/features/[feature]/` — cada feature es independiente y autocontenida (`src/features/raffles/` es la primera y sirve de referencia de estructura)

Cada feature tiene esta estructura interna:

```
src/features/[feature]/
├── core/
│   ├── domain/          (entities, interfaces, repositories, datasources)
│   ├── application/     (dtos, use-cases, validators, factories)
│   ├── infrastructure/  (mappers, datasource impls, repository impls)
│   └── di/              (inyección de dependencias)
└── presentation/        (components, hooks, context, pages)
```

### Reglas de importación entre capas (enforced por ESLint + dependency-cruiser)

| Desde            | Puede importar                         | No puede importar                      |
| ---------------- | -------------------------------------- | -------------------------------------- |
| `domain`         | nada externo (solo `application/dtos`) | `infrastructure`, `presentation`, `di` |
| `application`    | solo `domain`                          | `infrastructure`, `presentation`, `di` |
| `infrastructure` | `domain`                               | `presentation`, `di`                   |

## Estilo de código (reglas no obvias)

- **Solo importaciones absolutas**: todas las importaciones empiezan con `src/`. Rutas relativas (`../`, `./`) prohibidas.
- **Orden de importaciones** (enforced por `simple-import-sort`): react → third-party → `src/shared/` → shared domain → shared infra → shared app → feature domain → feature infra → feature app → other `src/`.
- **Tipos de retorno**: explícitos en todas las funciones `.ts` (excepto archivos bajo `**/presentation/**` y `**/ui/**`).
- **Booleans**: deben usar prefijo `is/should/has/can/did/will`, PascalCase después del prefijo.
- **Enums**: nunca usar `enum` nativo. Usar objeto `as const` + extracción con `typeof`. El archivo debe llamarse `*.enum.ts`.
- **Sin `any`**: usar `unknown` o tipos correctos.
- **Números mágicos**: prohibidos (excepto `-1`, `0`, `1`). Extraer a constantes con nombre.
- **Llaves**: siempre requeridas (estilo K&R), incluso para bloques de una sola línea.
- **Manejo de errores**: usar `CustomError` de `src/shared/core/errors/custom-error.error.ts`, nunca `Error` nativo.

## Nomenclatura de archivos (enforced por ls-lint)

Cada archivo debe tener un sufijo de tipo que coincida con su carpeta:

| Patrón de carpeta | Ejemplo de sufijo |
| ----------------- | ----------------- |
| `entities/`       | `*.entity.ts`     |
| `dtos/`           | `*.dto.ts`        |
| `interfaces/`     | `*.interface.ts`  |
| `repositories/`   | `*.repository.ts` |
| `datasources/`    | `*.datasource.ts` |
| `mappers/`        | `*.mapper.ts`     |
| `use-cases/`      | `*.use-case.ts`   |
| `pages/`          | `*.page.tsx`      |
| `hooks/`          | `*.hook.ts`       |
| `strategies/`     | `*.strategy.ts`   |
| `validators/`     | `*.validator.ts`  |

Todas las carpetas y archivos sin sufijo deben ser `kebab-case`.

## Convención de commits

Formato: `type(scope): descripción en imperativo` (minúsculas, sin punto final, ≤120 chars)

- **Tipos permitidos**: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`
- **Scopes permitidos**: `config`, `shared`, `public`, `deps`, `tools`, `root`, `ci`
- Nuevas features van a `develop` vía PR; `production` solo vía PR aprobado.

## Convención de ramas

Formato: `type/module-description` (ej. `feat/expenses-budget-form`)

Prefijos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`. Enforced por hook pre-push.

## Configuración de Prettier

Indentación de 4 espacios, doble comilla, trailing commas, 130 print width. Se ejecuta vía lint-staged en `*.{ts,tsx}` (prettier + eslint --fix) y `*.{json,md,css,html}` (solo prettier).

## Skills para nuevo código

El directorio `.agents/skills/` contiene guías paso a paso para crear código nuevo. Cargarlos con la herramienta skill cuando correspondan:

- `create-domain-feat` — Entities, datasources, repositories, mappers/implementations de infrastructure, y DTOs de Application
- `create-application-feat` — Use cases, validators (Zod), factories y wiring de DI
- `create-util-strategy` — Utilidades con patrón Strategy para desacoplar libs externas de la lógica de negocio
- `create-default-values` — Generadores de datos por defecto para población inicial
- `create-ui-use-case` — Integración de use cases en la capa de presentación

**Patrón DTO**: Factory Method con input `unknown`, validación con Zod, sin casts `as`. Ver docs de skills para ejemplos completos.

**Orden de wiring de DI** (en `di/[feature].dependency.ts`): Helpers → Mappers → DataSources → Repositories → Validators → Factories → Use Cases → exportar métodos `.execute` vinculados con `.bind`.

## Errores comunes

- Después de `pnpm install`, los hooks de Husky pueden no activarse. Siempre ejecutar `pnpm run prepare`.
- La plantilla de PR referencia `bun run lint` en su checklist — ignorar; usar `pnpm run lint`.
- La primera feature (`src/features/raffles/`) ya existe; usarla como referencia para crear nuevas. Estructura general en `.docs/structure-project.md`.
- React Compiler está habilitado vía babel-plugin-react-compiler (configurado en `vite.config.ts`).
- El alias de ruta `src/*` → `./src/*` está configurado tanto en `tsconfig.app.json` como en `vite.config.ts`.
