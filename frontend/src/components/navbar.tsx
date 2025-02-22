import { Link } from "react-router";

import devlinksLogo from "../assets/logo-devlinks.svg";

const Navbar = () => {
  return (
    <nav>
      <Link to="/" className="flex items-center gap-2">
        <img
          src={devlinksLogo}
          alt="link icon in a purple background"
          className="h-10 w-10"
        />
        <p className="text-3xl font-bold text-black">devlinks</p>
      </Link>
    </nav>
  );
};

export default Navbar;
