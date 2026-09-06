---
trigger: always_on
---

---

trigger: always_on
---

# Strict Code Style & Formatting Rules

When generating or modifying code, you MUST strictly adhere to the following constraints based on the project's ESLint configuration and architectural decisions.

## 1. General Style & Kernighan and Ritchie (K&R)

- **Formatting:** Strictly follow the Kernighan and Ritchie (K&R) style. Always use curly braces `{}` for all block statements (`if`, `while`, `for`, `switch`), even for single-line statements.
- **Language:** All code (variables, functions, classes, comments) MUST be written in English. Do not translate technical project terms (e.g., "sprint") to other languages.
- **Paths:** ALWAYS use absolute paths starting with `src/`. Relative paths (`../`, `./`, etc.) are STRICTLY FORBIDDEN in all files.
- **Modification Rule:** DO NOT rename existing variables, functions, or classes in the user's provided code unless explicitly instructed to do so. Do not alter existing business logic without permission.

## 2. Naming Conventions (No Abbreviations)

- **Variables & Properties:** Use English nouns. NO abbreviations. Use `camelCase` (global constants can be `UPPER_CASE`).
- **Functions & Methods:** Start with a verb (e.g., `get`, `create`, `validate`). Use `camelCase`.
- **Booleans:** Must start with a prefix like `is`, `has`, `should`, `can`, `did`, `will` (e.g., `isVerified`, `didFetch`). Must be `PascalCase` after the prefix.
- **Arrays/Collections:** Use plural nouns (e.g., `users`, `activeAccounts`).
- **Classes, Interfaces, & Types:** Use English nouns. Use `PascalCase`. Interfaces should not contain implementation details.
- **Enums (`*.enum.ts` files):** NEVER use the native `enum` keyword. Instead, use a Plain Old Javascript Object (POJO) with `as const` and extract its type using `typeof` and `keyof typeof`. The exported object must be `UPPER_CASE` and the extracted type `PascalCase`.

    ```typescript
    // src/shared/accounts/domain/account-type.enum.ts
    export const ACCOUNT_TYPE = {
        CASH: "cash",
        BANK: "bank",
        CREDIT: "credit",
        SAVINGS: "savings",
    } as const;

    export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];
    ```

- **Magic Values:** Avoid them completely. Extract numbers or strings into well-named constants. (Numbers `-1`, `0`, and `1` are allowed).

## 3. TypeScript & Object-Oriented Programming

- **No `any`:** The `any` type is strictly prohibited. Use `unknown` or define proper interfaces/types.
- **Access Modifiers:** All class properties and methods MUST have explicit access modifiers (`public`, `private`, `protected`).
- **Return Types:** Explicit function return types are mandatory in `.ts` files (typed function expressions are allowed).
- **Modern TypeScript Features:** Prefer optional chaining (`?.`), nullish coalescing (`??`), and `for-of` loops over older alternatives.
- **Unused Variables:** Any unused variables, arguments, or caught errors must be prefixed with an underscore (`_`).
- **Separation of Concerns:** Strictly separate DTOs (Data Transfer Objects) from Entity models. Do not assume their structures; ask the user for the Entity if needed.

## 4. React & TanStack Query Specific Rules

- **State Management:** DO NOT use standard React state (`useState`) for core logic or data fetching. Strictly use TanStack Query combined with custom hooks. Ensure all dependencies in hooks (`exhaustive-deps`) and query clients are stable.
- **Event Handlers:**
    - Functions passed as props must start with `on` (e.g., `onClick`, `onClose`).
    - Internal component functions handling events must start with `handle` (e.g., `handleButtonClick`, `handleModalClose`).

## 5. Clean Architecture Strict Boundaries

- **Domain Layer (`**/domain/**`):** MUST NOT import from `infrastructure`, `presentation`, or `di`.
- **Application Layer (`**/application/**`):** MUST ONLY interact with the `domain`. MUST NOT import from `infrastructure`, `presentation`, or `di`.
- **Infrastructure Layer (`**/infrastructure/**`):** MUST NOT import from `presentation` (UI) or `di`.

## 6. Imports Structure

Imports must be sorted automatically and cleanly exactly in this order:

1. React and third-party libraries (`^react`, `^@?\w`).
2. Global shared resources (`^src/shared/`).
3. Shared Domain resources (`^src/shared/.*/domain/`).
4. Shared Infrastructure resources (`^src/shared/.*/infrastructure/`).
5. Shared Application resources (`^src/shared/.*/application/`).
6. Feature Domain resources (`^src/features/.*/domain/`).
7. Feature Infrastructure resources (`^src/features/.*/infrastructure/`).
8. Feature Application resources (`^src/features/.*/application/`).
9. Other internal imports (`^src/`).
