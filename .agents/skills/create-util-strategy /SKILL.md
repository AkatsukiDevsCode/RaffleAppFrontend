---
name: create-util-strategy
description: crear una nueva utilidad aplicando el patrón Strategy en el core del proyecto. Este patrón ayuda a desacoplar las implementaciones específicas (ej. librerías externas o APIs nativas como `Intl`) de los casos de uso y componentes que las consumen.
---

## Estructura de Directorios

Toda nueva estrategia debe encapsularse como un adaptador dentro de `src/shared/core/adapters/[feature]/` siguiendo esta estructura:

```text
adapters/
  └── [feature]/
      ├── di/
      │   └── [feature].dependencies.ts
      ├── domain/
      │   ├── context/
      │   │   └── [feature].context.ts
      │   └── interface/
      │       ├── strategies/
      │       │   └── [feature]-strategy.interface.ts
      │       └── generators/
      │           └── [feature]-generator.interface.ts
      └── infrastructure/
          ├── generator/
          │   └── [feature].generator.ts
          └── strategies/
              └── [implementation]-[feature].strategy.ts
```

## Pasos de Implementación

### 1. Definir la Interfaz de la Estrategia (Domain)

Crea la interfaz que define el contrato de la utilidad en `domain/interface/`.

```typescript
// src/shared/core/adapters/[feature]/domain/interface/[feature]-strategy.interface.ts
export interface FeatureStrategy {
    executeMethod(param: string): string;
}
```

### 2. Definir la Interfaz del Generador (Domain)

Crea la interfaz que define el contrato para el generador, el cual debe extender la estrategia e incluir métodos adicionales como cambiar la estrategia en tiempo de ejecución.

```typescript
// src/shared/core/adapters/[feature]/domain/interface/[feature]-generator.interface.ts
import type { FeatureStrategy } from "./[feature]-strategy.interface";

export interface FeatureGenerator extends FeatureStrategy {
    changeStrategy(strategy: FeatureStrategy): void;
}
```

### 3. Crear el Contexto (Domain)

El contexto mantiene una referencia a la estrategia y delega la ejecución. **Nota importante:** En el constructor se debe utilizar el método de seteo (ej. `setStrategy`) para la asignación.

```typescript
// src/shared/core/adapters/[feature]/domain/context/[feature].context.ts
import type { FeatureStrategy } from "../interface/[feature]-strategy.interface";

export class FeatureContext implements FeatureStrategy {
    private strategy: FeatureStrategy;

    constructor(strategy: FeatureStrategy) {
        this.setStrategy(strategy);
    }

    public setStrategy(strategy: FeatureStrategy): void {
        this.strategy = strategy;
    }

    public executeMethod(param: string): string {
        return this.strategy.executeMethod(param);
    }
}
```

### 4. Implementar la Estrategia Concreta (Infrastructure)

Crea las implementaciones reales (usando librerías específicas o código nativo) en `infrastructure/strategies/`.

```typescript
// src/shared/core/adapters/[feature]/infrastructure/strategies/custom-[feature].strategy.ts
import type { FeatureStrategy } from "../../domain/interface/[feature]-strategy.interface";

export class CustomFeatureStrategy implements FeatureStrategy {
    public executeMethod(param: string): string {
        // Implementación real
        return `Processed: ${param}`;
    }
}
```

### 5. Crear el Generador Singleton (Infrastructure)

Crea una clase Singleton que actúe como proxy hacia el contexto. Ésta será la única forma de acceder a las funcionalidades del feature desde otras partes del sistema, garantizando un punto de control centralizado y un patrón Singleton por cada contexto.

```typescript
// src/shared/core/adapters/[feature]/infrastructure/generator/[feature].generator.ts
import type { FeatureStrategy } from "../../domain/interface/[feature]-strategy.interface";
import type { FeatureGenerator } from "../../domain/interface/[feature]-generator.interface";
import { FeatureContext } from "../../domain/context/[feature].context";
import { CustomFeatureStrategy } from "../strategies/custom-[feature].strategy";

export class FeatureGeneratorSingleton implements FeatureGenerator {
    private static instance: FeatureGeneratorSingleton;
    private readonly featureContext: FeatureContext;

    private constructor(strategy: FeatureStrategy) {
        this.featureContext = new FeatureContext(strategy);
    }

    public static getInstance(): FeatureGeneratorSingleton {
        if (!FeatureGeneratorSingleton.instance) {
            const defaultStrategy = new CustomFeatureStrategy();
            FeatureGeneratorSingleton.instance = new FeatureGeneratorSingleton(defaultStrategy);
        }
        return FeatureGeneratorSingleton.instance;
    }

    public executeMethod(param: string): string {
        return this.featureContext.executeMethod(param);
    }

    public changeStrategy(strategy: FeatureStrategy): void {
        this.featureContext.setStrategy(strategy);
    }
}
```

### 6. Configurar la Inyección de Dependencias (DI)

Instancia el generador y expórtalo en la capa de `di/`. No olvides tiparlo explícitamente con su interfaz de dominio para no filtrar tipos de la infraestructura.

```typescript
// src/shared/core/adapters/[feature]/di/[feature].dependencies.ts
import type { FeatureGenerator } from "../domain/interface/[feature]-generator.interface";
import { FeatureGeneratorSingleton } from "../infrastructure/generator/[feature].generator";

export const adapterFeatureGenerator: FeatureGenerator = FeatureGeneratorSingleton.getInstance();
```

### 7. Exponer Globalmente mediante un Helper

Finalmente, para facilitar su uso en la capa de presentación u otros lugares que solo requieran invocar funciones, crea un helper en `src/shared/core/helpers/` que encapsule las llamadas al método.

```typescript
// src/shared/core/helpers/[feature].helper.ts
import { adapterFeatureGenerator } from "src/shared/core/adapters/[feature]/di/[feature].dependencies";

export const featureHelper = (param: string): string => {
    return adapterFeatureGenerator.executeMethod(param);
};
```

## Beneficios

- **Desacoplamiento:** Los componentes no saben qué librería se utiliza internamente.
- **Flexibilidad:** Cambiar la implementación (ej. de una librería A a una librería B) solo requiere crear una nueva estrategia concreta e inyectarla por defecto en el Singleton.
- **Instancia Única:** Garantiza a través del patrón Singleton que solo haya una instancia del contexto a lo largo de toda la aplicación.
- **Mantenibilidad:** Sigue una arquitectura limpia y estandarizada en todo el proyecto.
