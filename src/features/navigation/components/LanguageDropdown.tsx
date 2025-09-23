"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "mm", label: "Myanmar", flag: "🇲🇲" },
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const activeLang = useMemo(() => {
    return languages.find((lang) => lang.code === locale) || languages[0];
  }, [locale]);

  const strippedPath = useMemo(() => {
    return pathname.replace(/^\/(en|mm)/, "");
  }, [pathname]);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent/50 transition cursor-pointer"
          aria-label="Change language"
        >
          <span className="text-lg">{activeLang.flag}</span>
          <span className="text-sm hidden lg:inline-block">
            {activeLang.label}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          {languages.map((language) => (
            <DropdownMenuItem key={language.code} asChild>
              <Link
                href={`/${language.code}${strippedPath}`}
                locale={language.code}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.label}</span>
                </div>
                {locale === language.code && <Check className="h-4 w-4 ml-2" />}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
