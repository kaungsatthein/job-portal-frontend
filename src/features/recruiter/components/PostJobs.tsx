"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { step1Schema, step2Schema } from "../schema/jobs";
import { JobFormValues } from "../types/jobs.type";
import StepPosition from "./steps/StepPosition";
import Stepper from "./steps/Stepper";
import StepReview from "./steps/StepReview";
import StepDetail from "./steps/StepDetail";
import { showToast } from "@/lib";

const mockCompanies = [
  { id: "1", name: "Tech Corp" },
  { id: "2", name: "Innovation Labs" },
  { id: "3", name: "Digital Solutions Inc" },
];

const PostJobs = ({ setTab }: { setTab: (tab: string) => void }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: yupResolver(step === 1 ? (step1Schema as any) : step2Schema),
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
  const selectedCompany = mockCompanies.find(
    (c) => c.id === formValues.companyId
  );

  const handleNext = async () => {
    const fields: (keyof JobFormValues)[] =
      step === 1
        ? ["title", "companyId"]
        : ["jobType", "location", "salaryRange", "description"];

    const valid = await trigger(fields);
    if (valid) setStep(step + 1);
  };

  const onSubmit = (data: JobFormValues) => {
    console.log("Job created:", data);
    // alert("Job posted successfully!");
    showToast("success", "Your job is undering admin's approval.");
  };

  return (
    <div>
      {/* Stepper Progress */}
      <Stepper step={step} />

      {/* Form */}
      <form>
        {step === 1 && (
          <StepPosition
            register={register}
            errors={errors}
            control={control}
            setTab={setTab}
            router={router}
            selectedCompany={selectedCompany}
            mockCompanies={mockCompanies}
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
            Back
          </Button>

          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit(onSubmit)}>
              Post Job
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostJobs;
