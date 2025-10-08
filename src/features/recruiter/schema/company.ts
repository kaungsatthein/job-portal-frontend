import * as yup from "yup";

export const companySchema = yup.object({
  name: yup.string().required("Company name is required"),
  industry: yup.string().required("Industry is required"),
});
