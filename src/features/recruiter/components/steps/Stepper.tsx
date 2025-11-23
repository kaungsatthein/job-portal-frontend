import { CheckCircle2 } from "lucide-react";

type StepperProps = {
  step: number;
  labels: {
    position: string;
    details: string;
    review: string;
  };
};

const Stepper = ({ step, labels }: StepperProps) => {
  return (
    <div className="my-4">
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((stepNumber, index) => (
          <div key={stepNumber} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center size-8 rounded-full font-semibold transition-colors ${
                step === stepNumber
                  ? "bg-primary text-primary-foreground"
                  : step > stepNumber
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > stepNumber ? (
                <CheckCircle2 className="size-5" />
              ) : (
                stepNumber
              )}
            </div>
            <span
              className={`font-medium hidden sm:inline ${
                step === stepNumber
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {stepNumber === 1
                ? labels.position
                : stepNumber === 2
                ? labels.details
                : labels.review}
            </span>
            {index < 2 && <div className="h-px w-8 sm:w-16 bg-border" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
