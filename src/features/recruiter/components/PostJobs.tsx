"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { createStep1Schema, createStep2Schema } from "../schema/jobs";
import { CompanyOption, JobFormValues } from "../types/jobs.type";
import StepPosition from "./steps/StepPosition";
import Stepper from "./steps/Stepper";
import StepReview from "./steps/StepReview";
import StepDetail from "./steps/StepDetail";
import { showToast } from "@/lib";
import { useTranslations } from "next-intl";
import { AnyObjectSchema } from "yup";
import { createJobPosting } from "@/features/job/services/job-postings";
import { useAuth } from "@/features/auth";
import { fetchCompanies } from "../services/company";

const PostJobs = ({ setTab }: { setTab: (tab: string) => void }) => {
  const [step, setStep] = useState(1);
  const t = useTranslations("PostJob");
  const step1Schema = useMemo<AnyObjectSchema>(() => createStep1Schema(t), [t]);
  const step2Schema = useMemo<AnyObjectSchema>(() => createStep2Schema(t), [t]);

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: yupResolver(step === 1 ? step1Schema : step2Schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      companyId: "",
      description: "",
      jobType: "",
      location: "",
      salaryRange: "",
    },
  });

  const formValues = watch();
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);

  const selectedCompany = companies.find(
    (company) => company.id === formValues.companyId
  );

  useEffect(() => {
    const loadCompanies = async () => {
      setCompaniesLoading(true);
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to load companies", error);
        showToast("error", t("stepPosition.noCompanies"));
      } finally {
        setCompaniesLoading(false);
      }
    };

    loadCompanies();
  }, [t]);

  const handleNext = async () => {
    const fields: (keyof JobFormValues)[] =
      step === 1
        ? ["title", "companyId"]
        : ["jobType", "location", "salaryRange", "description"];

    const valid = await trigger(fields);
    if (valid) setStep(step + 1);
  };

  const onSubmit = async (data: JobFormValues) => {
    if (!user || typeof user !== "object" || !(user as any)?.id) {
      showToast("error", "Unable to post job without recruiter account.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createJobPosting({
        recruiterId: (user as any).id,
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        jobType: data.jobType || "fulltime",
        location: data.location,
        salaryRange: data.salaryRange,
        status: "pending",
      });
      showToast("success", t("toast.created"));
      reset();
      setStep(1);
      setTab("myJobs");
    } catch (error: any) {
      console.error("Failed to create job posting", error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to create job posting."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Stepper Progress */}
      <Stepper
        step={step}
        labels={{
          position: t("stepper.position"),
          details: t("stepper.details"),
          review: t("stepper.review"),
        }}
      />

      {/* Form */}
      <form>
        {step === 1 && (
          <StepPosition
            register={register}
            errors={errors}
            control={control}
            setTab={setTab}
            selectedCompany={selectedCompany}
            companies={companies}
            companiesLoading={companiesLoading}
          />
        )}

        {step === 2 && (
          <StepDetail register={register} errors={errors} control={control} />
        )}

        {step === 3 && (
          <StepReview
            formValues={formValues}
            selectedCompany={selectedCompany}
          />
        )}

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            {t("actions.back")}
          </Button>

          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              {t("actions.next")}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? `${t("actions.post")}...` : t("actions.post")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostJobs;
