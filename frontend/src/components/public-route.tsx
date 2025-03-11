import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/auth-store";

interface PublicRouteProps {
  redirectPath?: string;
}

const PublicRoute = ({
  redirectPath = "/customize-link",
}: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
