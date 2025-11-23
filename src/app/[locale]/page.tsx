import { JobSearchBar, TrendingJobs } from "@/features/job";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Home");

  return (
    <div className="mx-4 lg:mx-8 flex flex-col items-center">
      <div className="w-full lg:max-w-4xl lg:mt-20">
        <JobSearchBar />
      </div>
      <div className="mt-6 text-center">
        <span className="text-sm text-muted-foreground">
          {t.rich("searchPrompt", {
            count: (chunks) => (
              <span className="font-bold text-foreground">{chunks}</span>
            ),
            value: "196,252",
          })}
        </span>
      </div>

      <TrendingJobs />
    </div>
  );
}
