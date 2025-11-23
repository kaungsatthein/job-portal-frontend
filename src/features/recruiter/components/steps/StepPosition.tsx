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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, Plus } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { CompanyOption, JobFormValues } from "../../types/jobs.type";

type StepPositionProps = {
  register: UseFormRegister<JobFormValues>;
  errors: FieldErrors<JobFormValues>;
  control: Control<JobFormValues>;
  setTab: (tab: string) => void;
  selectedCompany?: CompanyOption;
  mockCompanies: CompanyOption[];
};

const StepPosition = ({
  register,
  errors,
  control,
  setTab,
  selectedCompany,
  mockCompanies,
}: StepPositionProps) => {
  const t = useTranslations("PostJob");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("stepPosition.title")}</CardTitle>
        <CardDescription>{t("stepPosition.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            {t("stepPosition.positionLabel")}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            placeholder={t("stepPosition.positionPlaceholder")}
            {...register("title")}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            {t("stepPosition.companyLabel")}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal bg-transparent"
                id="company"
              >
                {selectedCompany
                  ? selectedCompany.name
                  : t("stepPosition.selectCompany")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("stepPosition.selectCompanyTitle")}</DialogTitle>
                <DialogDescription>
                  {t("stepPosition.selectCompanyDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {mockCompanies.length > 0 ? (
                  mockCompanies.map((company) => (
                    <Controller
                      key={company.id}
                      name="companyId"
                      control={control}
                      render={({ field }) => (
                        <Button
                          type="button"
                          variant={
                            field.value === company.id ? "default" : "outline"
                          }
                          className="w-full justify-start"
                          onClick={() => {
                            field.onChange(company.id);
                          }}
                        >
                          <Building2 className="size-4 mr-2" />
                          {company.name}
                        </Button>
                      )}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">
                      {t("stepPosition.noCompanies")}
                    </p>
                    <Button
                      type="button"
                      onClick={() => setTab("myCompany")}
                      className="gap-2"
                    >
                      <Plus className="size-4" />
                      {t("stepPosition.createCompany")}
                    </Button>
                  </div>
                )}
              </div>
              {mockCompanies.length > 0 && (
                <div className="border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 bg-transparent"
                    onClick={() => setTab("myCompany")}
                  >
                    <Plus className="size-4" />
                    {t("stepPosition.createNewCompany")}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
          {errors.companyId && (
            <p className="text-sm text-destructive">
              {errors.companyId.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepPosition;
