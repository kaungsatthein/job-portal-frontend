import { ApplicationStatusDetailContainer } from "@/features/application/components/ApplicationStatusDetail";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

const ApplicationDetailPage = async ({ params }: PageProps) => {
  const { id, locale } = await params;

  return (
    <div className="mx-4 my-6 lg:mx-8">
      <ApplicationStatusDetailContainer applicationId={id} locale={locale} />
    </div>
  );
};

export default ApplicationDetailPage;
