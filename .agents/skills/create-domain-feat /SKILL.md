---
name: create-domain-feat
description: Crea una nueva funcionalidad en la capa de Domain e Infrastructure, incluyendo los DTOs de Application, siguiendo los patrones de Clean Architecture del proyecto.
---

# Guía para crear una nueva funcionalidad (Domain, Infrastructure & Application DTOs)

Al crear una nueva funcionalidad o módulo, debes adherirte estrictamente a los siguientes patrones de diseño y estructura de Clean Architecture.

## 1. Domain Layer (`src/features/[feature]/core/domain/`)

### Entities (`entities/[feature].entity.ts`)

- Define una interfaz `[Feature]EntityProps` para tipar los datos recibidos en el constructor.
- Crea la clase `[Feature]Entity` con propiedades `public readonly`.
- El constructor debe recibir el objeto `props` de tipo `[Feature]EntityProps`, y debes **desestructurar las propiedades** para asignarlas internamente (buena práctica de TypeScript).

**Ejemplo de estructura de una Entidad:**

```typescript
interface ExampleEntityProps {
    id: string;
    // ... otras propiedades
}

export class ExampleEntity {
    public readonly id: string;
    // ... otras propiedades

    public constructor(props: ExampleEntityProps) {
        // Desestructuración obligatoria de props
        const { id /*, otras propiedades */ } = props;

        this.id = id;
        // ... asignación del resto
    }
}
```

### DataSources (`datasources/[feature].datasource.ts`)

- Debe ser una clase abstracta (`abstract class`) que actúe como interfaz.
- Declara los métodos usando `public abstract`.
- Los métodos deben retornar siempre Promesas, ya sea `Promise<[Feature]Entity>`, `Promise<[Feature]Entity[]>` o `Promise<void>`.
- Evita incluir lógica de implementación; solo firmas de métodos.

### Repositories (`repositories/[feature].repository.ts`)

- Debe ser idéntico en estructura al DataSource: una clase abstracta (`abstract class`) con métodos `public abstract`.
- Esto permite mantener la abstracción y desacoplamiento del repositorio de dominio.

## 2. Infrastructure Layer (`src/features/[feature]/core/infrastructure/`)

### Mappers (`mappers/[feature].mapper.ts`)

- Define una interfaz `[Feature]Mapper` con los métodos base (ej. `toEntity(rawObject: Record<string, unknown>): [Feature]Entity`).
- Crea la clase de implementación `[Feature]MapperImpl` que implemente dicha interfaz.
- Encárgate del mapeo seguro de objetos en bruto (ej. bases de datos, almacenamiento local) a instancias de la Entidad de Dominio.
- **Manejo de Errores:** En caso de necesitar generar un error (por ejemplo, si faltan datos críticos), **SIEMPRE** debes usar la clase personalizada `CustomError` ubicada en `src/shared/core/errors/custom-error.error.ts` (ej. `throw CustomError.badRequest(...)`). No uses el `Error` nativo.

### DataSource Implementations (`datasources/[source]/[feature].datasource.ts`)

- Crea una clase concreta (ej. `[Feature]DataSourcePreferences`) que implemente la clase abstracta de Dominio.
- Inyecta sus dependencias por constructor (como Mappers, Helpers u otros servicios).
- Realiza el acceso a datos real (APIs, Storage, etc.). **Evita en lo posible colocar lógica o reglas de validación que correspondan a reglas de negocio.** Esta capa debe estar enfocada exclusivamente al manejo, persistencia y obtención de los datos.
- **Manejo de Errores:** En caso de necesitar generar o capturar una excepción, **SIEMPRE** debes usar la clase personalizada `CustomError` ubicada en `src/shared/core/errors/custom-error.error.ts` (ej. `throw CustomError.notFound(...)`). No uses el `Error` nativo.

### Repository Implementations (`repositories/[feature].repository.ts`)

- Crea una clase concreta `[Feature]RepositoryImpl` que implemente la clase abstracta del Repositorio de Dominio.
- Inyecta el `[Feature]DataSource` por constructor.
- Esta clase debe actuar principalmente como un puente (proxy), delegando la ejecución real al DataSource (salvo que requiera lógica extra, como cacheo o validaciones de infraestructura).

## 3. Application Layer - DTOs (`src/features/[feature]/core/application/dtos/[feature]/`)

Al crear DTOs de entrada (ej. `create-[feature].dto.ts`, `update-[feature].dto.ts`), sigue estrictamente el patrón de Factory Method para validación:

- Define una interfaz plana exportable (ej. `Create[Feature]Dto`) con las propiedades requeridas.
- Crea una clase de implementación (ej. `Create[Feature]DtoImpl`) que implemente dicha interfaz.
- La clase debe tener propiedades `public readonly` y un constructor `private` que reciba los `props` (la interfaz).
- Implementa un método estático de fábrica `create(data: unknown, validator: EntityValidator<Create[Feature]Dto>): Create[Feature]Dto`.
- Este método `create` debe recibir un validador inyectado (`EntityValidator`), validar el parámetro `data` (que es `unknown`), y finalmente retornar una nueva instancia del DTO basándose en los datos ya tipados y validados.
