import apiInstance from "@/lib/api-config/instance";
import { CompanyOption } from "../types/jobs.type";

type ApiCompany = {
  id?: string;
  name?: string;
  status?: string;
};

type ApiIndustry = {
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
    .filter((company: ApiCompany) => company.status === "open")
    .map((company: ApiCompany) => ({
      id: company.id ?? "",
      name: company.name ?? "Unnamed company",
    }))
    .filter((company) => company.id && company.name);
};

export type IndustryOption = {
  id: string;
  name: string;
};

export const fetchIndustries = async (): Promise<IndustryOption[]> => {
  const response = await apiInstance.get("/industry");
  const industries = response.data?.data ?? response.data ?? [];

  if (!Array.isArray(industries)) {
    return [];
  }

  return industries
    .map((industry: ApiIndustry) => ({
      id: industry.id ?? "",
      name: industry.name ?? "Unnamed industry",
    }))
    .filter((industry) => industry.id && industry.name);
};

export type CreateCompanyPayload = {
  name: string;
  industryId: string;
};

export const createCompany = async (payload: CreateCompanyPayload) => {
  const response = await apiInstance.post("/company", payload);
  return response.data?.data ?? response.data;
};
