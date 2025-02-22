import { Routes, Route } from "react-router";
import RegisterPage from "./pages/register-page";
import LoginPage from "./pages/login-page";
import CustomizeLinkPage from "./pages/customize-link-page";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/customize-link" element={<CustomizeLinkPage />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
