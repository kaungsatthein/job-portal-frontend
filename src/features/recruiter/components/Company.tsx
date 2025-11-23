"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { createCompanySchema } from "../schema/company";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "@/lib";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CompanyFormValues = {
  name: string;
  industry: string;
};

// Demo industries (replace with API call later)
const demoIndustries = [
  { id: "technology" },
  { id: "finance" },
  { id: "healthcare" },
  { id: "education" },
];

const Company = () => {
  const t = useTranslations("Company");
  const companySchema = useMemo(() => createCompanySchema(t), [t]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CompanyFormValues>({
    resolver: yupResolver(companySchema),
    defaultValues: {
      industry: "",
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    console.log("Company created:", data);
    showToast("success", t("toastSuccess"));
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <h1 className="text-md font-semibold text-foreground">
          {t("title")}
        </h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm">
              {t("nameLabel")}
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder={t("namePlaceholder")}
              className="border p-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm">
              {t("industryLabel")}
            </label>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full border p-2 rounded">
                    <SelectValue placeholder={t("industryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {demoIndustries.map((industry) => (
                      <SelectItem key={industry.id} value={industry.id}>
                        {t(`industries.${industry.id}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.industry && (
              <p className="text-red-500 text-sm mt-1">
                {errors.industry.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Company;
