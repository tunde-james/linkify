import { Link, useLocation } from "react-router";
import { Link as LinkIcon, CircleUser, Eye } from "lucide-react";

import devlinksLogo from "/images/logo-devlinks.svg";
import { Button } from "./button";
import { useAuthStore } from "../store/auth-store";
import { useLogout } from "../api/nevada-51/hooks/use-auth";

const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useLogout();

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav>
      {!isAuthenticated && !user ? (
        <div className="flex items-center justify-start md:justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={devlinksLogo}
              alt="link icon in a purple background"
              className="h-10 w-10"
            />
            <p className="text-3xl font-bold text-black md:text-5xl lg:text-6xl">
              devlinks
            </p>
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4">
          <Link to="/customize-link" className="flex items-center gap-2">
            <img
              src={devlinksLogo}
              alt="link icon in a purple background"
              className="h-10 w-10"
            />
            <p className="hidden text-3xl font-bold text-black md:block">
              devlinks
            </p>
          </Link>

          <ul className="flex items-center justify-center gap-4">
            <li>
              <Link
                to="/customize-link"
                className={`flex items-center gap-4 ${isActive("/customize-link") ? "bg-primary-50 text-primary rounded-lg px-7 py-3" : "bg-white"}`}
              >
                <LinkIcon className="h-5 w-5" />
                <p className="hidden md:block">Links</p>
              </Link>
            </li>

            <li className="group relative">
              <Link
                to="/profile"
                className={`flex items-center gap-4 ${isActive("/profile") ? "bg-primary-50 text-primary rounded-lg px-7 py-3" : "bg-white"}`}
              >
                <CircleUser className="h-5 w-5" />
                <p className="hidden md:block">Profile Details</p>
              </Link>

              <ul className="invisible absolute left-0 z-10 mt-1 origin-top-right scale-95 transform overflow-hidden rounded-md bg-white opacity-0 shadow-lg transition-all duration-300 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                <li>
                  <Button onClick={() => logout()} size="sm">
                    Logout
                  </Button>
                </li>
              </ul>
            </li>
          </ul>

          <Link
            to="/preview"
            className={`flex items-center gap-4 ${isActive("/preview") ? "bg-primary-50 text-primary rounded-lg px-7 py-3" : "bg-white"}`}
          >
            <Eye className="h-5 w-5" />
            <p className="hidden md:block">Preview</p>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
