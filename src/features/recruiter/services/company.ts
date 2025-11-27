import apiInstance from "@/lib/api-config/instance";
import { CompanyOption } from "../types/jobs.type";

type ApiCompany = {
  id?: string;
  name?: string;
};

export const fetchCompanies = async (): Promise<CompanyOption[]> => {
  const response = await apiInstance.get("/company");
  const companies = response.data?.data ?? response.data ?? [];

  if (!Array.isArray(companies)) {
    return [];
  }

  return companies
    .map((company: ApiCompany) => ({
      id: company.id ?? "",
      name: company.name ?? "Unnamed company",
    }))
    .filter((company) => company.id && company.name);
};

export const createCompany = async (name: string) => {
  const response = await apiInstance.post("/company", { name });
  return response.data?.data ?? response.data;
};
