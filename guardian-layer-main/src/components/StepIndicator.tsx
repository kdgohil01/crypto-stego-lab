import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  processing: boolean;
}

export const StepIndicator = ({ steps, currentStep, processing }: StepIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber && processing;
        const isPending = currentStep < stepNumber;
        
        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-smooth font-semibold text-sm",
                  isCompleted && "bg-success border-success text-success-foreground animate-pulse-cyber",
                  isActive && "bg-primary border-primary text-primary-foreground animate-pulse",
                  isPending && "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  stepNumber
                )}
              </div>
              <div
                className={cn(
                  "text-xs font-medium text-center min-w-16 transition-smooth",
                  isCompleted && "text-success",
                  isActive && "text-primary font-semibold",
                  isPending && "text-muted-foreground"
                )}
              >
                {step}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 transition-smooth",
                  isCompleted && "bg-success",
                  isActive && "bg-primary/50",
                  isPending && "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};