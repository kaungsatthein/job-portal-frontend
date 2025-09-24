import Link from "next/link";
import { LoginForm } from "../auth";
import { LanguageDropdown, ThemeToggle } from "./components";

const NavBar = () => {
  return (
    <nav className="my-4 flex items-center justify-between mx-4 lg:mx-8">
      <Link href="/">
        <span className="font-bold text-xl text-primary font-sans">
          HireHub
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <LanguageDropdown />
        <ThemeToggle />
        <LoginForm />
      </div>
    </nav>
  );
};

export default NavBar;
