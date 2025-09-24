import { JobSearchBar } from "@/features/job";

export default function JobsPage({
  searchParams,
}: {
  searchParams: { what?: string; where?: string };
}) {
  const { what, where } = searchParams;

  return (
    <>
      <JobSearchBar what={what} where={where} />
    </>
  );
}
