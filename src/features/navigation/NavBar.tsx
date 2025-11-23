"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { LoginForm } from "../auth";
import { LanguageDropdown, ThemeToggle } from "./components";

const NavBar = () => {
  const locale = useLocale();

  return (
    <nav className="my-4 flex items-center justify-between mx-4 lg:mx-8">
      <Link href="/" locale={locale}>
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
