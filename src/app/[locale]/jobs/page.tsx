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
      <div className="mt-10 mx-4 lg:mx-8">
        <JobSearchBar what={what} where={where} />
      </div>
    </>
  );
}
