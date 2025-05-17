
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  change?: {
    value: number;
    positive?: boolean;
  };
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  change,
  iconColor = "bg-health-primary/10 text-health-primary",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            {change && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    change.positive ? "text-health-good" : "text-health-critical"
                  )}
                >
                  {change.positive ? "+" : ""}
                  {change.value}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">from last period</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn("p-2 rounded-full", iconColor)}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
