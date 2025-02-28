import { Link } from "react-router";

import devlinksLogo from "../assets/logo-devlinks.svg";
import { Button } from "./button";
import { useAuthStore } from "../store/auth-store";
import { useLogout } from "../hooks/use-auth";

const Navbar = () => {
  const { isAuthenticated } = useAuthStore();
  const { logout } = useLogout();

  return (
    <nav>
      {isAuthenticated ? (
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src={devlinksLogo}
              alt="link icon in a purple background"
              className="h-10 w-10"
            />
            <p className="text-3xl font-bold text-black">devlinks</p>
          </Link>

          <div className="">
            <Link to="">Links</Link>
            <Link to="">Profile Details</Link>
            <Link to="">Preview</Link>
          </div>

          <div>
            <Button onClick={() => logout()}>Logout</Button>
          </div>
        </div>
      ) : (
        <Link to="/" className="flex items-center gap-2">
          <img
            src={devlinksLogo}
            alt="link icon in a purple background"
            className="h-10 w-10"
          />
          <p className="text-3xl font-bold text-black">devlinks</p>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
