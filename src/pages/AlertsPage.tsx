
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  Heart,
  Activity,
  ChevronDown,
  CheckCircle,
  User,
  Clock,
  Thermometer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiService } from "@/services/api";

const AlertsPage = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "new" | "resolved">("all");

  // Fetch all patients to get their alerts
  const { data: patients, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: apiService.getAllPatients,
  });

  // Fetch alerts for each patient
  const { data: alertsData, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ["all-alerts", patients],
    queryFn: async () => {
      if (!patients || patients.length === 0) return [];
      
      const allAlerts = await Promise.all(
        patients.map(async (patient) => {
          const patientAlerts = await apiService.getPatientAlerts(patient._id);
          return patientAlerts.map(alert => ({
            ...alert,
            patient: patient
          }));
        })
      );
      
      return allAlerts.flat();
    },
    enabled: !!patients && patients.length > 0,
  });

  // Filter alerts based on status
  const filteredAlerts = alertsData?.filter(alert => {
    if (filter === "all") return true;
    return alert.status === filter;
  });

  // Resolve alert mutation
  const resolveAlertMutation = useMutation({
    mutationFn: (alertId: string) => {
      return apiService.resolveAlert(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-alerts"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and manage patient health alerts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filter === "all" ? "All Alerts" : filter === "new" ? "New Alerts" : "Resolved Alerts"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Alerts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("new")}>
                New Alerts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("resolved")}>
                Resolved Alerts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading || isLoadingAlerts ? (
        <div className="text-center py-6">Loading alerts...</div>
      ) : filteredAlerts && filteredAlerts.length > 0 ? (
        <div className="space-y-6">
          {filteredAlerts.map((alert, index) => (
            <Card key={index} className={alert.status === "new" ? "border-health-critical" : ""}>
              <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-health-critical/20 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-health-critical" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Alert for {alert.patient_name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(alert.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant={alert.status === "new" ? "destructive" : "outline"}>
                    {alert.status === "new" ? "New Alert" : "Resolved"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to={`/patients/${alert.patient_id}`}>View Patient</Link>
                    </Button>
                    {alert.status === "new" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveAlertMutation.mutate(alert.patient_id)}
                        className="flex items-center gap-1 text-health-good"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {alert.alerts.map((alertItem, alertIdx) => (
                    <div key={alertIdx} className="border rounded-md overflow-hidden">
                      <div className="bg-health-critical/10 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {alertItem.vital.includes("heart") ? (
                            <Heart className="h-4 w-4 text-health-critical" />
                          ) : alertItem.vital.includes("blood") ? (
                            <Activity className="h-4 w-4 text-health-critical" />
                          ) : alertItem.vital.includes("temperature") ? (
                            <Thermometer className="h-4 w-4 text-health-critical" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-health-critical" />
                          )}
                          <span className="font-medium capitalize">
                            {alertItem.vital.replace(/_/g, " ")}
                          </span>
                        </div>
                        <Badge variant="destructive">Abnormal</Badge>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Current Value:</span>
                          <span className="text-xl font-bold">
                            {alertItem.value} 
                            <span className="ml-1 text-xs text-muted-foreground">
                              {alertItem.vital.includes("heart") ? "bpm" : 
                               alertItem.vital.includes("blood") ? "mmHg" : 
                               alertItem.vital.includes("temperature") ? "°C" : "%"}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Normal Range:</span>
                          <span className="text-sm font-medium">
                            {alertItem.threshold_min} - {alertItem.threshold_max} 
                            <span className="ml-1 text-xs text-muted-foreground">
                              {alertItem.vital.includes("heart") ? "bpm" : 
                               alertItem.vital.includes("blood") ? "mmHg" : 
                               alertItem.vital.includes("temperature") ? "°C" : "%"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No alerts found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filter !== "all" 
                ? `There are no ${filter} alerts at the moment` 
                : "All patients are stable at the moment"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertsPage;
