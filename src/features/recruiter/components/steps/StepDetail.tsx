"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { JobFormValues } from "../../types/jobs.type";

type StepDetailProps = {
  register: UseFormRegister<JobFormValues>;
  errors: FieldErrors<JobFormValues>;
  control: Control<JobFormValues>;
};

const StepDetail = ({ register, errors, control }: StepDetailProps) => {
  const t = useTranslations("PostJob");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          {t("stepDetail.title")}
        </CardTitle>
        <CardDescription>{t("stepDetail.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Job Type */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            {t("stepDetail.jobTypeLabel")}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="jobType" className="w-full">
                  <SelectValue
                    placeholder={t("stepDetail.jobTypePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fulltime">
                    {t("stepDetail.jobTypeOptions.fullTime")}
                  </SelectItem>
                  <SelectItem value="parttime">
                    {t("stepDetail.jobTypeOptions.partTime")}
                  </SelectItem>
                  <SelectItem value="contract">
                    {t("stepDetail.jobTypeOptions.contract")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.jobType && (
            <p className="text-sm text-destructive">{errors.jobType.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            {t("stepDetail.locationLabel")}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Input
            id="location"
            placeholder={t("stepDetail.locationPlaceholder")}
            {...register("location")}
          />
        </div>

        {/* Salary */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            {t("stepDetail.salaryLabel")}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Input
            id="salaryRange"
            placeholder={t("stepDetail.salaryPlaceholder")}
            {...register("salaryRange")}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            {t("stepDetail.descriptionLabel")}{" "}
            <span className="text-destructive">*</span>
          </label>
          <textarea
            id="description"
            placeholder={t("stepDetail.descriptionPlaceholder")}
            className="min-h-64 border rounded-md p-3"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepDetail;
