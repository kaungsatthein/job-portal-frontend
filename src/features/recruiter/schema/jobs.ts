import * as yup from "yup";

export const step1Schema = yup.object({
  title: yup.string().required("Job title is required"),
  companyId: yup.string().required("Please select a company"),
});

export const step2Schema = yup.object({
  title: yup.string().required("Job title is required"),
  companyId: yup.string().required("Please select a company"),
  description: yup.string().required("Job description is required"),
  jobType: yup.string().required("Job type is required"),
  location: yup.string(),
  salaryRange: yup.string(),
});
