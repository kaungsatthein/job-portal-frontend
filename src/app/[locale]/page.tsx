import { JobSearchBar } from "@/features/job";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-20 w-full">
      <JobSearchBar />
      <div className="mt-6 text-center">
        <span className="text-sm text-muted-foreground">
          Search <span className="font-bold text-foreground">196,252</span> jobs
          now
        </span>
      </div>
    </div>
  );
}
