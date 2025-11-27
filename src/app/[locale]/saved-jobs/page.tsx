import { SavedJobsGrid } from "@/features/saved-jobs";
import { demoSavedJobs } from "@/features/saved-jobs/SavedJobsGrid";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const SavedJobsPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations("SavedJobs");

  return (
    <div className="mx-4 my-6 lg:mx-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground lg:text-2xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("subtitle", { count: demoSavedJobs.length })}</p>
      </div>
      <div className="mt-4">
        <SavedJobsGrid locale={locale} />
      </div>
    </div>
  );
};

export default SavedJobsPage;
