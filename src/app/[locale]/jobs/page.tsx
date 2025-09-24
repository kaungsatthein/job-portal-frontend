import { JobList, JobSearchBar } from "@/features/job";

export const jobs = [
  {
    id: 1,
    title: "Part-Time Food Taster - Woodlands/ $15 per hour/ Weekday only!",
    company: "ScienTec Consulting",
    location: "Woodlands",
    pay_range: "$15 - $15 per month",
    job_type: "Part time",
    experience_required: "No experience required",
    working_hours: "2pm to 5pm - From Monday to Thursday Only",
    posted: "23h ago",
    job_scope: "Participate in...",
  },
  {
    id: 2,
    title: "Part-Time Food Taster - Woodlands/ $15 per hour/ Weekday only!",
    company: "ScienTec Consulting",
    location: "Woodlands",
    pay_range: "$15 - $15 per month",
    job_type: "Part time",
    experience_required: "No experience required",
    working_hours: "2pm to 5pm - From Monday to Thursday Only",
    posted: "23h ago",
    job_scope: "Participate in...",
  },
  {
    id: 3,
    title: "Part-Time Food Taster - Woodlands/ $15 per hour/ Weekday only!",
    company: "ScienTec Consulting",
    location: "Woodlands",
    pay_range: "$15 - $15 per month",
    job_type: "Part time",
    experience_required: "No experience required",
    working_hours: "2pm to 5pm - From Monday to Thursday Only",
    posted: "23h ago",
    job_scope: "Participate in...",
  },
  {
    id: 4,
    title: "Part-Time Food Taster - Woodlands/ $15 per hour/ Weekday only!",
    company: "ScienTec Consulting",
    location: "Woodlands",
    pay_range: "$15 - $15 per month",
    job_type: "Part time",
    experience_required: "No experience required",
    working_hours: "2pm to 5pm - From Monday to Thursday Only",
    posted: "23h ago",
    job_scope: "Participate in...",
  },
  {
    id: 5,
    title: "Part-Time Food Taster - Woodlands/ $15 per hour/ Weekday only!",
    company: "ScienTec Consulting",
    location: "Woodlands",
    pay_range: "$15 - $15 per month",
    job_type: "Part time",
    experience_required: "No experience required",
    working_hours: "2pm to 5pm - From Monday to Thursday Only",
    posted: "23h ago",
    job_scope: "Participate in...",
  },
];

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ what?: string; where?: string }>;
}) {
  const params = await searchParams;
  const { what, where } = params;

  return (
    <div className="flex flex-col items-center w-full gap-10">
      <JobSearchBar what={what} where={where} />
      <JobList jobs={jobs} />
    </div>
  );
}
