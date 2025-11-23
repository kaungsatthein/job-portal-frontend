import * as yup from "yup";

type Translator = (key: string) => string;

export const createCompanySchema = (t: Translator) =>
  yup.object({
    name: yup.string().required(t("validation.name")),
    industry: yup.string().required(t("validation.industry")),
  });
