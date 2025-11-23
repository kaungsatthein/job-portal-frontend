export type JobFormStep1 = {
  title: string;
  companyId: string;
};

export type JobFormStep2 = JobFormStep1 & {
  description: string;
  jobType: string;
  location: string;
  salaryRange: string;
};

export type JobFormValues = JobFormStep2;

export type CompanyOption = {
  id: string;
  name: string;
};
