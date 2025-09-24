import { JobSearchBar } from "@/features/job";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full gap-10">
      <JobSearchBar />
    </div>
  );
}
