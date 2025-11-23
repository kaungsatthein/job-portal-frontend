import * as yup from "yup";

type Translator = (key: string) => string;

export const createStep1Schema = (t: Translator) =>
  yup.object({
    title: yup.string().required(t("validation.title")),
    companyId: yup.string().required(t("validation.company")),
  });

export const createStep2Schema = (t: Translator) =>
  yup.object({
    title: yup.string().required(t("validation.title")),
    companyId: yup.string().required(t("validation.company")),
    description: yup.string().required(t("validation.description")),
    jobType: yup.string().required(t("validation.jobType")),
    location: yup.string(),
    salaryRange: yup.string(),
  });
