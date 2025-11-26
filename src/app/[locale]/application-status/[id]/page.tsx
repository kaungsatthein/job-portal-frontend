import { notFound } from "next/navigation";
import { ApplicationStatusDetail } from "@/features/application/components/ApplicationStatusDetail";
import { applications } from "@/features/application/data";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

const ApplicationDetailPage = async ({ params }: PageProps) => {
  const { id, locale } = await params;
  const application = applications.find((app) => app.id === id);

  if (!application) {
    return notFound();
  }

  return (
    <div className="mx-4 my-6 lg:mx-8">
      <ApplicationStatusDetail application={application} locale={locale} />
    </div>
  );
};

export default ApplicationDetailPage;
