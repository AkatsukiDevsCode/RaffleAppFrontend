import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "src/shared/presentation/ui/layouts/app.layout";
import Dashboard from "src/shared/presentation/ui/pages/dashboard.page";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Dashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
