
import { cn } from "@/lib/utils";

interface VitalIndicatorProps {
  name: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  className?: string;
}

export function VitalIndicator({
  name,
  value,
  unit,
  min,
  max,
  className,
}: VitalIndicatorProps) {
  let status: "critical" | "warning" | "good" = "good";
  
  if (min !== undefined && max !== undefined) {
    if (value < min || value > max) {
      // Outside range - critical
      status = "critical";
    } else if (value < min + (max - min) * 0.1 || value > max - (max - min) * 0.1) {
      // Within 10% of range limits - warning
      status = "warning";
    }
  }

  const statusColor = {
    critical: "text-health-critical",
    warning: "text-health-warning",
    good: "text-health-good",
  };

  const statusBg = {
    critical: "bg-health-critical/10",
    warning: "bg-health-warning/10",
    good: "bg-health-good/10",
  };
  
  const statusDot = {
    critical: "before:bg-health-critical status-pulse-critical",
    warning: "before:bg-health-warning status-pulse-warning",
    good: "before:bg-health-good status-pulse-good",
  };

  return (
    <div className={cn("p-4 rounded-lg", statusBg[status], className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">{name}</span>
        <div className={cn("h-3 w-3 rounded-full relative status-pulse", statusDot[status])}>
          <span className={cn("block h-3 w-3 rounded-full", statusColor[status])}></span>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className={cn("text-2xl font-bold", statusColor[status])}>{value}</span>
        <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
      </div>
      {min !== undefined && max !== undefined && (
        <div className="mt-2 text-xs text-muted-foreground">
          Normal range: {min}-{max} {unit}
        </div>
      )}
    </div>
  );
}
