import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyJobs from "./MyJobs";
import PostJobs from "./PostJobs";
import Applicants from "./Applicants";
import Account from "./Account";

const RecruiterScreen = () => {
  return (
    <div className="mx-4 lg:mx-8">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Recruiter Dashboard
        </h1>
        <span className="text-muted-foreground text-sm">
          Manage your jobs, posts, and accounts
        </span>
      </div>
      <Tabs defaultValue="myJobs" className="w-full my-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="myJobs">My Jobs</TabsTrigger>
          <TabsTrigger value="postJobs">Create Your Jobs</TabsTrigger>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="myJobs" className="mt-3">
          <MyJobs />
        </TabsContent>
        <TabsContent value="postJobs" className="mt-3">
          <PostJobs />
        </TabsContent>
        <TabsContent value="applicants" className="mt-3">
          <Applicants />
        </TabsContent>
        <TabsContent value="account" className="mt-3">
          <Account />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruiterScreen;
