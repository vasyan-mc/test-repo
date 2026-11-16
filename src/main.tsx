import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import { AuthPage } from "./pages/auth.tsx";
import { ProtectedRoute } from "./components/protected-route.tsx";
import { GuestRoute } from "./components/guest-route.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<Routes>
				<Route element={<GuestRoute />}>
					<Route path="/auth" element={<AuthPage />} />
				</Route>

				<Route element={<ProtectedRoute />}>
					<Route path="/" element={<App />} />
					<Route path="*" element={<Navigate to={"/"} />} />
				</Route>
			</Routes>
		</HashRouter>
	</StrictMode>,
);
