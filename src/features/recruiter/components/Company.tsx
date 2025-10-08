"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { companySchema } from "../schema/company";
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

type CompanyFormValues = yup.InferType<typeof companySchema>;

// Demo industries (replace with API call later)
const demoIndustries = [
  { id: 1, name: "Technology" },
  { id: 2, name: "Finance" },
  { id: 3, name: "Healthcare" },
  { id: 4, name: "Education" },
];

const Company = () => {
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
    showToast("success", "Your company is successfully created.");
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <h1 className="text-md font-semibold text-foreground">
          Create Your Company
        </h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm">Company Name</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter your company name"
              className="border p-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm">Industry</label>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full border p-2 rounded">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoIndustries.map((industry) => (
                      <SelectItem key={industry.id} value={industry.name}>
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
          </div>

          <Button type="submit" className="w-full">
            Create Your Company
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Company;
