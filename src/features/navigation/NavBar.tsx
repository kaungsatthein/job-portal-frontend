import { ResearcherLoginForm } from "../auth";
import { LanguageDropdown, ThemeToggle } from "./components";

const NavBar = () => {
  return (
    <div className="my-4 flex items-center justify-between">
      <span className="font-bold text-xl text-primary">HireHub</span>
      <div className="flex items-center gap-2">
        <LanguageDropdown />
        <ThemeToggle />
        <ResearcherLoginForm />
      </div>
    </div>
  );
};

export default NavBar;
