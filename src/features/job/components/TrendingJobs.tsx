"use client";

import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useQueryParams } from "../hooks/useQueryParams";

const categoryKeys = ["popular", "roles", "locations", "companies"] as const;
type CategoryKey = (typeof categoryKeys)[number];

const popularSearches = [
  "sap",
  "ship broker",
  "ai",
  "the supreme hr advisory pte ltd",
  "commodities intern",
  "elearning",
  "statistic",
  "temp usher",
  "casual cafe",
  "civil engineering",
  "sales work visa",
  "policy",
  "morning teacher",
  "graphic designer",
  "regulatory",
];

const roleTitles = [
  "software engineer",
  "data analyst",
  "product manager",
  "ux designer",
  "marketing specialist",
  "business analyst",
  "project manager",
  "sales executive",
  "hr coordinator",
  "financial analyst",
];

const locations = [
  "singapore",
  "kuala lumpur",
  "jakarta",
  "bangkok",
  "manila",
  "ho chi minh city",
  "remote",
  "hybrid",
  "central business district",
  "orchard road",
];

const companies = [
  "google",
  "microsoft",
  "amazon",
  "meta",
  "shopee",
  "grab",
  "sea limited",
  "dbs bank",
  "ocbc bank",
  "singtel",
];

const categoryData: Record<CategoryKey, string[]> = {
  popular: popularSearches,
  roles: roleTitles,
  locations,
  companies,
};

export default function TrendingJobs() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("popular");
  const t = useTranslations("TrendingJobs");
  const pathname = usePathname();
  const { push } = useQueryParams();

  const currentSearches =
    categoryData[activeCategory as keyof typeof categoryData];
  const locale = pathname.split("/")[1] || "en";
  const jobsPath = `/${locale}/jobs`;

  const handleSearchClick = (search: string) => {
    const term = search.trim();
    if (!term) return;

    if (activeCategory === "locations") {
      push(jobsPath, { where: term });
      return;
    }

    push(jobsPath, { what: term });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-30">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-border">
        {categoryKeys.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-2 text-sm font-medium transition-colors relative ${
              activeCategory === category
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(`categories.${category}`)}
          </button>
        ))}
      </div>

      {/* Search Pills */}
      <div className="flex flex-wrap gap-3">
        {currentSearches.map((search, index) => (
          <Button
            key={`${search}-${index}`}
            variant="outline"
            size="sm"
            className=" px-2 py-1 bg-background border border-border hover:bg-muted hover:border-primary/50 transition-colors group"
            onClick={() => handleSearchClick(search)}
          >
            <Search className="w-2 h-2 text-primary group-hover:text-primary" />
            <span className="text-sm text-foreground">{search}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
