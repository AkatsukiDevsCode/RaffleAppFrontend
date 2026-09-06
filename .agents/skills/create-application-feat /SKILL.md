---
name: create-application-feat
description: Crea componentes de la capa de Application (Use Cases, Validators, Factories y DI) siguiendo los patrones de Clean Architecture del proyecto.
---

# Guía para crear la capa de Application (Use Cases, Validators, Factories y DI)

Al implementar la lógica de aplicación para una nueva funcionalidad, debes seguir estrictamente los siguientes patrones arquitectónicos.

## Estructura de Carpetas (Separación por Responsabilidad)

Es obligatorio dividir la feature en subcarpetas según sus responsabilidades, independientemente de la cantidad de archivos que posea. Esto garantiza una escalabilidad ordenada. Cada capa (`dtos`, `use-cases`, `validators`) debe contener carpetas con el nombre de cada subdominio o responsabilidad (ej. `transactions`, `budget`, `categories`).

**Ejemplo de Estructura Esperada:**

```text
src/features/transactions/core/application/
├── dtos
│   └── transactions
│       ├── create-transaction.dto.ts
│       └── update-transaction.dto.ts
├── factories
│   ├── interfaces
│   │   └── transaction-dto-factory.interface.ts
│   └── transaction-dto.factory.ts
├── use-cases
│   └── transactions
│       ├── create-transaction.use-case.ts
│       ├── delete-transaction.use-case.ts
│       ├── get-transactions.use-case.ts
│       └── update-transaction.use-case.ts
└── validators
    ├── di-feat-transaction.validator.ts
    ├── interface
    │   └── transaction-feat.interface.ts
    └── transaction
        ├── interfaces
        │   ├── container-response.interface.ts
        │   └── generate-container.interface.ts
        ├── schemas
        │   ├── create-transaction.schema.ts
        │   └── update-transaction.schema.ts
        └── transaction-container.validator.ts
```

## 1. Validators (Validación con Zod)

### Schemas (`validators/[feature]/schemas/[action]-[feature].schema.ts`)

- Utiliza la librería `zod` para definir el esquema de validación.
- Incluye mensajes de error personalizados para cada validación (ej. `{ message: "Invalid amount" }`).
- Define constantes para valores mágicos como números mínimos de caracteres o expresiones regulares.

### Interfaces del Contenedor (`validators/[feature]/interfaces/`)

- **`container-response.interface.ts`**: Define la interfaz `[Feature]ValidatorContainer` que tipa el objeto que contiene todos los validadores (ej. `create[Feature]Validator: EntityValidator<Create[Feature]Dto>`).
- **`generate-container.interface.ts`**: Crea una clase abstracta `GenerateValidator[Feature]Container` con un único método abstracto `generate[Feature]Validators(): [Feature]ValidatorContainer`.

### Contenedor de Validadores (`validators/[feature]/[feature]-container.validator.ts`)

- Crea la clase `[Feature]ZodValidatorContainer` que implemente la interfaz generadora.
- Su constructor debe inyectar el helper `ValidatorCreator`.
- El método de generación debe usar el helper junto con los esquemas de Zod para crear los validadores: `this.validatorCreator<[Feature]Dto>([Action][Feature]ValidateSchema)`.

### Exportador General de Validadores (`validators/di-feat-[feature].validator.ts`)

- Instancia aquí los contenedores Zod creados inyectándoles la función `createValidator` de los helpers globales.
- Exporta un objeto constante (ej. `validator[Feature]FeatureContainer`) con el resultado de invocar los métodos generadores.

## 2. DTO Factories (`factories/`)

### Interfaces (`factories/interfaces/[feature]-dto-factory.interface.ts`)

- Define la interfaz `[Feature]DtoFactory` con métodos para cada acción que requiera DTO, recibiendo datos en crudo (`rawData: unknown`) y retornando la interfaz del DTO.

### Implementación (`factories/[feature]-dto.factory.ts`)

- Crea `[Feature]DtoFactoryImpl` inyectando por constructor los `EntityValidator` correspondientes a cada DTO.
- En la implementación de cada método, delega la creación llamando al método estático `create()` de la clase DTO, pasando `rawData` y el validador inyectado.

### Regla Estricta para DTOs: Prohibición de Type Casting (`as`)

Queda **estrictamente prohibido** utilizar el casteo manual con la palabra reservada `as` dentro del método estático `create()` de cualquier DTO.
El DTO debe recibir un valor de tipo `unknown` y es el **validador** (ej. Zod) el único responsable de garantizar y transformar los tipos de forma segura. Si el validador no es capaz de aplicar ese casteo y te obliga a usar `as`, significa que el patrón se está aplicando incorrectamente.

**Ejemplo correcto del método `create` (sin usar `as`):**

```typescript
public static create(data: unknown, validator: EntityValidator<UpdateTransactionDto>): UpdateTransactionDto {
    const validatedData = validator.validate(data);

    return new UpdateTransactionDtoImpl({
        type: validatedData.type,
        amount: validatedData.amount,
        categoryId: validatedData.categoryId,
        categoryName: validatedData.categoryName,
        description: validatedData.description,
        accountId: validatedData.accountId,
        date: validatedData.date,
    });
}
```

## 3. Use Cases (`use-cases/[feature]/[action]-[feature].use-case.ts`)

- **Orquestador Central:** El caso de uso actúa como el orquestador principal de las reglas de negocio y del Repositorio. Aquí es donde esta skill se complementa directamente con la skill de creación de dominio (`create-domain-feat`), delegando la persistencia y obtención de datos a la capa de infraestructura mientras se controla el flujo de la aplicación.
- Crea una clase por cada caso de uso (ej. `Create[Feature]UseCase`).
- **Inyección por constructor**: Inyecta el `[Feature]Repository` y, si la acción requiere entrada de datos complejos, inyecta también el `[Feature]DtoFactory`.
- Define un método `execute(rawData: unknown)` (o con los argumentos necesarios).
- El flujo del método `execute` debe ser:
    1. Instanciar el DTO usando el factory (si aplica).
    2. Ejecutar las reglas de negocio correspondientes a través del Repositorio.
    3. Retornar el resultado (generalmente la Entidad de Dominio).
- **Manejo de Errores**: Si necesitas lanzar un error dentro de un caso de uso, **SIEMPRE** utiliza la clase personalizada `CustomError` ubicada en `src/shared/core/errors/custom-error.error.ts`.

## 4. Dependency Injection (DI) (`di/[feature].dependency.ts`)

Centraliza la creación de instancias para el módulo. Respeta estrictamente el siguiente orden de instanciación:

1. **Helpers y Generadores** (ej. utilidades para UUID, fechas).
2. **Mappers** (clases Impl).
3. **DataSources** (ya sea directos o usando un DataSourceFactory inyectando los mappers).
4. **Repositories** (inyectando sus respectivos DataSources).
5. **Validators**: Desestructura los validadores desde `validator[Feature]FeatureContainer`.
6. **Factories**: Instancia los DTO Factories inyectando los validadores del paso anterior.
7. **Use Cases**: Instancia todos los casos de uso inyectando los Repositorios y Factories necesarios.
8. **Exportación de Acciones**: Exporta funciones puras vinculadas a los métodos `execute` usando `.bind` (ej. `export const ExecuteCreate[Feature]UseCase = create[Feature]UseCase.execute.bind(create[Feature]UseCase);`). Estas funciones son las que consumirá la capa de Presentación.

### Validación Final (Typecheck)

Una vez que hayas colocado los archivos y configurado la capa "di", es **obligatorio** ejecutar cualquiera de los siguientes comandos en la terminal (según tu sistema operativo):

```bash
npm run typecheck
# o bien
npm run typecheck:logs:windows
# o bien
npm run typecheck:logs:linux
```

Esto tiene como fin garantizar que no se hayan inyectado dependencias incorrectas, utilizado clases inexistentes o introducido fallos al momento de tipar los datos.
