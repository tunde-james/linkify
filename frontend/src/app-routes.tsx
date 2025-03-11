import { Routes, Route, Navigate } from "react-router";

import RegisterPage from "./pages/register-page";
import LoginPage from "./pages/login-page";
import CustomizeLinkPage from "./pages/customize-link-page";
import ProtectedRoute from "./components/protected-route";
import ProfileDetailsPage from "./pages/profile-details-page";
import PreviewPage from "./pages/preview-page";
import PublicRoute from "./components/public-route";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/customize-link" element={<CustomizeLinkPage />} />
        <Route path="/profile" element={<ProfileDetailsPage />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
