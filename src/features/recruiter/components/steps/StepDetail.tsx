import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import { Controller } from "react-hook-form";

const StepDetail = ({ register, errors, control }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Job Details
        </CardTitle>
        <CardDescription>
          Provide detailed information about the position
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Job Type */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            Job type <span className="text-destructive">*</span>
          </label>
          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="jobType" className="w-full">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.jobType && (
            <p className="text-sm text-destructive">{errors.jobType.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            Location <span className="text-destructive">*</span>
          </label>
          <Input
            id="location"
            placeholder="e.g. San Francisco, CA or Remote"
            {...register("location")}
          />
        </div>

        {/* Salary */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            Salary Range <span className="text-destructive">*</span>
          </label>
          <Input
            id="salaryRange"
            placeholder="e.g. $120,000 - $150,000"
            {...register("salaryRange")}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">
            Job Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="description"
            placeholder="Describe the role, responsibilities, requirements..."
            className="min-h-64 border rounded-md p-3"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepDetail;
