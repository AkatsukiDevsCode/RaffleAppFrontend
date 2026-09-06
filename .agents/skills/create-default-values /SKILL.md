---
name: create-default-values
description: Crea generadores de valores por defecto (Default Generators) para poblar datos iniciales respetando la Clean Architecture.
---

# Guía para crear Valores por Defecto (Default Generators)

Cuando necesites generar datos iniciales o por defecto (por ejemplo, para llenar una base de datos local vacía en el primer inicio de la aplicación), debes aislar esta responsabilidad utilizando el patrón de **Generators** en la capa de **Domain**.

A continuación, se detalla el flujo de trabajo para crear y consumir valores por defecto.

## 1. Domain Layer - Generators (`domain/generators/`)

### Interfaces e Implementaciones (`domain/generators/default-[name].generator.ts`)

- Crea un archivo específico para el generador de la entidad (ej. `default-categories.generator.ts`).
- Define una interfaz `Default[Name]Generator` con un único método `create()` que retorne un arreglo de las Entidades de Dominio correspondientes (ej. `CategoryEntity[]`).
- Crea la implementación `Default[Name]GeneratorImpl` que implemente la interfaz.
- Inyecta por constructor cualquier helper o dependencia necesaria para la creación (como un `UUIDHelper` para generar IDs únicos).
- El método `create()` simplemente debe instanciar y retornar el arreglo de Entidades con los valores por defecto.

**Ejemplo:**

```typescript
export interface DefaultCategoriesGenerator {
    create(): CategoryEntity[];
}

export class DefaultCategoriesGeneratorImpl implements DefaultCategoriesGenerator {
    public constructor(private readonly uuidGenerator: UUIDHelper) {}

    public create(): CategoryEntity[] {
        return [
            new CategoryEntity(this.uuidGenerator(), "Alimentos", "🍔", "#f97316"),
            new CategoryEntity(this.uuidGenerator(), "Transporte", "🚗", "#3b82f6"),
        ];
    }
}
```

## 2. Infrastructure Layer - DataSources (`infrastructure/datasources/...`)

El consumo de los generadores por defecto ocurre en la capa de Infraestructura, típicamente en los DataSources locales (como `Preferences` o SQLite), cuando se detecta que no existen datos guardados.

- Inyecta la interfaz del generador (`Default[Name]Generator`) por constructor en el DataSource (ej. `CategoryDataSourcePreferences`).
- Al realizar una consulta (ej. `getCategories()`), verifica si existen datos almacenados.
- Si no existen datos, invoca el método `.create()` del generador inyectado, persiste los datos en el almacenamiento local y luego retorna esas entidades.

**Ejemplo:**

```typescript
public async getCategories(): Promise<CategoryEntity[]> {
    const { value } = await Preferences.get({ key: this.storageKey });

    // Si hay datos, se mapean y retornan
    if (value) {
        const rawData = JSON.parse(value) as unknown[];
        return this.categoryMapper.toArrayEntities(rawData);
    }

    // Si no hay datos, se generan por defecto, se guardan y se retornan
    const defaultCategories = this.defaultCategoriesGenerator.create();
    await Preferences.set({
        key: this.storageKey,
        value: JSON.stringify(defaultCategories),
    });
    return defaultCategories;
}
```

## 3. Application Layer - Dependency Injection (`di/[feature].dependency.ts`)

Para unir las piezas, debes instanciar el generador e inyectarlo en el lugar correspondiente dentro del archivo de inyección de dependencias.

- Instancia el generador, típicamente bajo una sección inicial de _Generators_ o _Factories_.
- Inyecta los helpers necesarios (como `uuidHelper`).
- Pasa la instancia del generador al DataSource (o al factory de DataSources).

**Ejemplo:**

```typescript
//* Generators / Factories
export const defaultCategoriesFactory = new DefaultCategoriesGeneratorImpl(uuidHelper);

// ... luego se inyecta en el DataSource ...
const dataSourceFactory = new DataSourceFactoryImpl(
    // ... otros parametros
    defaultCategoriesFactory,
    uuidHelper,
);
```
