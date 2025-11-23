"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Building2,
} from "lucide-react";
import { CompanyOption, JobFormValues } from "../../types/jobs.type";

type StepReviewProps = {
  formValues: JobFormValues;
  selectedCompany?: CompanyOption;
};

const StepReview = ({ formValues, selectedCompany }: StepReviewProps) => {
  const t = useTranslations("PostJob");
  const jobTypeLabelMap: Record<string, string> = {
    FULL_TIME: t("stepDetail.jobTypeOptions.fullTime"),
    PART_TIME: t("stepDetail.jobTypeOptions.partTime"),
    CONTRACT: t("stepDetail.jobTypeOptions.contract"),
    INTERNSHIP: t("stepDetail.jobTypeOptions.internship"),
    REMOTE: t("stepDetail.jobTypeOptions.remote"),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t("stepReview.title")}
        </CardTitle>
        <CardDescription>{t("stepReview.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="pb-4 border-b">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Building2 className="size-4" />
              {selectedCompany?.name}
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {formValues.title || t("stepReview.untitled")}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm">
              {formValues.jobType && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
                  <Briefcase className="size-3.5" />
                  {jobTypeLabelMap[formValues.jobType] ||
                    formValues.jobType.replace("_", " ")}
                </span>
              )}
              {formValues.location && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-full">
                  <MapPin className="size-3.5" />
                  {formValues.location}
                </span>
              )}
              {formValues.salaryRange && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-full">
                  <DollarSign className="size-3.5" />
                  {formValues.salaryRange}
                </span>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="size-4" />
              {t("stepReview.jobDescription")}
            </h4>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap bg-muted/30 p-6 rounded-lg border">
              {formValues.description || t("stepReview.noDescription")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepReview;
