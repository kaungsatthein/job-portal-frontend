"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="fixed bottom-0 w-full bg-primary text-secondary py-2 text-center text-sm">
      © {new Date().getFullYear()} HireHub — {t("tagline")}
    </footer>
  );
}
