import type { KnipConfig } from "knip";

const knipConfiguration: KnipConfig = {
    // Archivos ignorados explícitamente
    ignoreBinaries: ["only-allow"],
    // Todos los archivos que Knip deberia analizar
    project: ["src/**/*.ts", "src/**/*.tsx"],
    // Ignorar las exportaciones que solo se usan dentro del mismo archivo
    ignoreExportsUsedInFile: true,
};

export default knipConfiguration;
