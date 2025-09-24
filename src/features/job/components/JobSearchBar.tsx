"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { useQueryParams } from "../hooks/useQueryParams";

type JobSearchBarProps = {
  what?: string;
  where?: string;
};

export default function JobSearchBar({
  what = "",
  where = "",
}: JobSearchBarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const locale = segments[1] || "en"; // fallback
  const action = `/${locale}/jobs`;
  const { push } = useQueryParams();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const whatInput = form.what as HTMLInputElement;
        const whereInput = form.where as HTMLInputElement;
        push(action, {
          what: whatInput.value || undefined,
          where: whereInput.value || undefined,
        });
      }}
      className="sm:w-full lg:max-w-4xl "
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label
            htmlFor="what"
            className="block text-sm font-medium text-foreground mb-1"
          >
            What
          </label>
          <div className="relative">
            <Input
              id="what"
              name="what"
              type="text"
              placeholder="Job title, company, keyword"
              defaultValue={what}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1">
          <label
            htmlFor="where"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Where
          </label>
          <div className="relative">
            <Input
              id="where"
              name="where"
              type="text"
              placeholder="City, district, state"
              defaultValue={where}
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Button type="submit">Search jobs</Button>
      </div>
    </form>
  );
}
