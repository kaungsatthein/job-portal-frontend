import { JobSearchBar } from "@/features/job";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ what?: string; where?: string }>;
}) {
  const params = await searchParams;
  const { what, where } = params;

  return (
    <>
      <JobSearchBar what={what} where={where} />
    </>
  );
}
