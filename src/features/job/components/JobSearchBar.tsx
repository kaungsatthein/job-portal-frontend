"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useQueryParams } from "../hooks/useQueryParams";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type JobSearchBarProps = {
  what?: string;
  where?: string;
};

export default function JobSearchBar({
  what = "",
  where = "",
}: JobSearchBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsString = useMemo(() => searchParams.toString(), [searchParams]);
  const [whatValue, setWhatValue] = useState(what);
  const [whereValue, setWhereValue] = useState(where);
  const segments = pathname.split("/");
  const locale = segments[1] || "en";
  const action = `/${locale}/jobs`;
  const { push } = useQueryParams();
  const t = useTranslations("JobSearchBar");

  useEffect(() => {
    const nextWhat = what ?? searchParams.get("what") ?? "";
    const nextWhere = where ?? searchParams.get("where") ?? "";
    setWhatValue(nextWhat);
    setWhereValue(nextWhere);
  }, [paramsString, searchParams, what, where]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        push(action, {
          what: whatValue || undefined,
          where: whereValue || undefined,
        });
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end sm:w-full lg:max-w-4xl">
        <div className="flex-1">
          <label
            htmlFor="what"
            className="block text-sm font-medium text-foreground mb-1"
          >
            {t("what")}
          </label>
          <div className="relative">
            <Input
              id="what"
              name="what"
              type="text"
              placeholder={t("whatPlaceholder")}
              value={whatValue}
              onChange={(e) => setWhatValue(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1">
          <label
            htmlFor="where"
            className="block text-sm font-medium text-foreground mb-1"
          >
            {t("where")}
          </label>
          <div className="relative">
            <Input
              id="where"
              name="where"
              type="text"
              placeholder={t("wherePlaceholder")}
              value={whereValue}
              onChange={(e) => setWhereValue(e.target.value)}
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Button type="submit">{t("search")}</Button>
      </div>
    </form>
  );
}
