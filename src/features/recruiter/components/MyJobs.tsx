"use client";

import { useTranslations } from "next-intl";

const MyJobs = () => {
  const t = useTranslations("Recruiter");
  return <div className="font-semibold">{t("tabs.myJobs")}</div>;
};

export default MyJobs;
