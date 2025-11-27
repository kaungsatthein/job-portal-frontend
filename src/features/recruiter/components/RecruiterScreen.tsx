"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyJobs from "./MyJobs";
import PostJobs from "./PostJobs";
import Account from "./Account";
import Company from "./Company";
import { useState } from "react";
import { useTranslations } from "next-intl";

const RecruiterScreen = () => {
  const [tab, setTab] = useState("myJobs");
  const t = useTranslations("Recruiter");
  return (
    <div className="mx-4 lg:mx-8">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
        <span className="text-muted-foreground text-sm">{t("subtitle")}</span>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="w-full my-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="myJobs">{t("tabs.myJobs")}</TabsTrigger>
          <TabsTrigger value="postJobs">{t("tabs.create")}</TabsTrigger>
          <TabsTrigger value="myCompany">{t("tabs.company")}</TabsTrigger>
          {/* <TabsTrigger value="account">{t("tabs.account")}</TabsTrigger> */}
        </TabsList>
        <TabsContent value="myJobs" className="mt-3">
          <MyJobs />
        </TabsContent>
        <TabsContent value="postJobs" className="mt-3">
          <PostJobs setTab={setTab} />
        </TabsContent>
        <TabsContent value="myCompany" className="mt-3">
          <Company />
        </TabsContent>
        {/* <TabsContent value="account" className="mt-3">
          <Account />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default RecruiterScreen;
