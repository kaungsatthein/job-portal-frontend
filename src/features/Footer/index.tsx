import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="fixed bottom-0 w-full bg-primary text-secondary py-2 text-center text-sm">
      © {new Date().getFullYear()} HireHub — {t("tagline")}
    </footer>
  );
}
