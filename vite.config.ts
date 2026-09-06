import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            src: "/src",
        },
    },
    plugins: [tailwindcss(), react(), babel({ presets: [reactCompilerPreset()] })],
});
