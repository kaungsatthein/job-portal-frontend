import { JobSearchBar, TrendingJobs } from "@/features/job";

export default function Home() {
  return (
    <div className="mx-4 lg:mx-8 flex flex-col items-center">
      <div className="w-full lg:max-w-4xl lg:mt-20">
        <JobSearchBar />
      </div>
      <div className="mt-6 text-center">
        <span className="text-sm text-muted-foreground">
          Search <span className="font-bold text-foreground">196,252</span> jobs
          now
        </span>
      </div>

      <TrendingJobs />
    </div>
  );
}
