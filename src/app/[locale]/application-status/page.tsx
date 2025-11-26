import { ApplicationStatusBoard } from "@/features/application";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const ApplicationStatusPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  return <ApplicationStatusBoard locale={locale} />;
};

export default ApplicationStatusPage;
