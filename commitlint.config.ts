import type { UserConfig } from "@commitlint/types";

const commitlintConfiguration: UserConfig = {
    extends: [],
    rules: {
        "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "chore"]],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],

        "scope-enum": [
            2,
            "always",
            [
                "config", // Para src/config/
                "shared", // Para src/shared/
                "public", // Para public/
                "deps", // Para dependencias (package.json, pnpm-lock.yaml)
                "tools", // Para herramientas (vite, eslint, tsconfig, commitlint, etc.)
                "root", // Para App.tsx, main.tsx, index.html y assets base
                "ci", // Para .github/, .husky/, y flujos de trabajo
            ],
        ],
        "scope-case": [2, "always", "kebab-case"],
        "scope-empty": [0],

        "subject-case": [0],
        "subject-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "header-max-length": [2, "always", 120],
    },
};

export default commitlintConfiguration;
