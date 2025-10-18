import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, Plus } from "lucide-react";
import { Controller } from "react-hook-form";

const StepPosition = ({
  register,
  errors,
  control,
  setTab,
  selectedCompany,
  mockCompanies,
}: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Position Information</CardTitle>
        <CardDescription>
          Enter the job title and select your company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            Position <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            placeholder="e.g. Senior Software Engineer"
            {...register("title")}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            Company <span className="text-destructive">*</span>
          </label>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal bg-transparent"
                id="company"
              >
                {selectedCompany ? selectedCompany.name : "Select a company"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Company</DialogTitle>
                <DialogDescription>
                  Choose the company for this job posting
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {mockCompanies.length > 0 ? (
                  mockCompanies.map((company: any) => (
                    <Controller
                      key={company.id}
                      name="companyId"
                      control={control}
                      render={({ field }) => (
                        <Button
                          type="button"
                          variant={
                            field.value === company.id ? "default" : "outline"
                          }
                          className="w-full justify-start"
                          onClick={() => {
                            field.onChange(company.id);
                          }}
                        >
                          <Building2 className="size-4 mr-2" />
                          {company.name}
                        </Button>
                      )}
                    />
                  ))
                ) : (
                  // <></>
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">No companies found</p>
                    <Button
                      type="button"
                      onClick={() => setTab("myCompany")}
                      className="gap-2"
                    >
                      <Plus className="size-4" />
                      Create Company
                    </Button>
                  </div>
                )}
              </div>
              {mockCompanies.length > 0 && (
                <div className="border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 bg-transparent"
                    onClick={() => setTab("myCompany")}
                  >
                    <Plus className="size-4" />
                    Create New Company
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
          {errors.companyId && (
            <p className="text-sm text-destructive">
              {errors.companyId.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepPosition;
