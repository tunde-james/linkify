import { Routes, Route, Navigate } from "react-router";
import RegisterPage from "./pages/register-page";
import LoginPage from "./pages/login-page";
import CustomizeLinkPage from "./pages/customize-link-page";
import ProtectedRoute from "./components/protected-route";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/customize-link" element={<CustomizeLinkPage />} />
        <Route
          path="/profile"
          element={<div>Profile Page (Coming soon)</div>}
        />
        <Route
          path="/preview"
          element={<div>Preview Page (Coming soon)</div>}
        />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
