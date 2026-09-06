import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Router from "src/shared/presentation/ui/routes/router";

import "src/index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Router />
    </StrictMode>,
);
