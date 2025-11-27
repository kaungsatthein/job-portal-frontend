"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
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
import {
  createCompany,
  fetchIndustries,
  IndustryOption,
} from "../services/company";

type CompanyFormValues = {
  name: string;
  industry: string;
};

const Company = () => {
  const t = useTranslations("Company");
  const companySchema = useMemo(() => createCompanySchema(t), [t]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [industries, setIndustries] = useState<IndustryOption[]>([]);
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(true);
  const [industryError, setIndustryError] = useState<string | null>(null);
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

  useEffect(() => {
    let isMounted = true;
    const loadIndustries = async () => {
      setIsLoadingIndustries(true);
      setIndustryError(null);
      try {
        const result = await fetchIndustries();
        if (isMounted) {
          setIndustries(result);
        }
      } catch (error: any) {
        console.error("Failed to fetch industries", error);
        if (isMounted) {
          setIndustryError("Failed to load industries.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingIndustries(false);
        }
      }
    };

    loadIndustries();
    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setIsSubmitting(true);
      await createCompany({
        name: data.name,
        industryId: data.industry,
      });
      showToast("success", t("toastSuccess"));
      reset();
    } catch (error: any) {
      console.error("Failed to create company", error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to create company."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h1 className="text-md font-semibold text-foreground">{t("title")}</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm">{t("nameLabel")}</label>
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingIndustries || Boolean(industryError)}
                >
                  <SelectTrigger className="w-full border p-2 rounded">
                    <SelectValue placeholder={t("industryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingIndustries && (
                      <SelectItem value="loading" disabled>
                        {t("loadingIndustries")}
                      </SelectItem>
                    )}
                    {!isLoadingIndustries && industries.length === 0 && (
                      <SelectItem value="empty" disabled>
                        {t("noIndustries")}
                      </SelectItem>
                    )}
                    {industries.map((industry) => (
                      <SelectItem key={industry.id} value={industry.id}>
                        {industry.name}
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
            {industryError && (
              <p className="text-red-500 text-sm mt-1">{industryError}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? `${t("submit")}...` : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Company;
