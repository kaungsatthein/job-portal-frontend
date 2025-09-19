"use client";

import {
  DropdownMenuGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckLine, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "mm", label: "Myanmar", flag: "🇲🇲" },
];

const LanguageDropdown = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent/50 transition">
          <span className="text-lg">{selectedLanguage.flag}</span>
          <span className="text-sm">{selectedLanguage.label}</span>
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
            <DropdownMenuItem
              key={language.code}
              onSelect={() => setSelectedLanguage(language)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{language.flag}</span>
                <span>{language.label}</span>
              </div>
              {selectedLanguage.code === language.code && (
                <CheckLine className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
