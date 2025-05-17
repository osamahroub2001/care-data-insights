
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Database, 
  AlertTriangle, 
  Play, 
  RefreshCw,
  Heart,
  Activity,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiService } from "@/services/api";

const SimulationPage = () => {
  const queryClient = useQueryClient();
  const [simulatingData, setSimulatingData] = useState(false);
  const [simulatingFailure, setSimulatingFailure] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateDataMutation = useMutation({
    mutationFn: apiService.simulateData,
    onMutate: () => {
      setSimulatingData(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      
      // Clear interval after the expected time
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
      }, 3000);
    },
    onSuccess: () => {
      setTimeout(() => {
        setSimulatingData(false);
        setProgress(100);
        queryClient.invalidateQueries();
        toast.success("Data simulation completed successfully");
      }, 3000);
    },
    onError: () => {
      setSimulatingData(false);
      setProgress(0);
      toast.error("Data simulation failed");
    },
  });

  const simulateFailureMutation = useMutation({
    mutationFn: apiService.simulateFailure,
    onMutate: () => {
      setSimulatingFailure(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 4;
        });
      }, 100);
      
      // Clear interval after the expected time
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
      }, 2500);
    },
    onSuccess: () => {
      setTimeout(() => {
        setSimulatingFailure(false);
        setProgress(100);
        queryClient.invalidateQueries();
        toast.success("Node failure simulation completed");
      }, 2500);
    },
    onError: () => {
      setSimulatingFailure(false);
      setProgress(0);
      toast.error("Node failure simulation failed");
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Simulation</h1>
        <p className="text-muted-foreground">
          Run simulations to test the system and generate sample data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-health-primary" />
                <span>Generate Test Data</span>
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-health-primary/10 text-health-primary flex items-center justify-center">
                <Play className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Generate sample patient data and vital signs to test the monitoring system. 
              This will create patients, doctors, relationships, and 48 hours of vital signs data.
            </p>

            {simulatingData && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Simulation progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => simulateDataMutation.mutate()}
              disabled={simulatingData || simulatingFailure}
            >
              {simulatingData ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simulating...
                </>
              ) : (
                "Generate Test Data"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-health-warning" />
                <span>Simulate Node Failure</span>
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-health-warning/10 text-health-warning flex items-center justify-center">
                <RefreshCw className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Test system resilience by simulating a database node failure. 
              This will randomly select a node to fail and test the system's ability to recover.
            </p>

            {simulatingFailure && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Simulation progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => simulateFailureMutation.mutate()}
              disabled={simulatingData || simulatingFailure}
            >
              {simulatingFailure ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simulating...
                </>
              ) : (
                "Simulate Node Failure"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium text-lg mb-4">Multi-Database Healthcare Monitoring System</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-health-primary mb-2">Databases & Data Distribution</h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    <span className="font-medium">MongoDB:</span> Patient and doctor records with region-based sharding
                  </li>
                  <li>
                    <span className="font-medium">InfluxDB:</span> Time-series vital signs data
                  </li>
                  <li>
                    <span className="font-medium">Neo4j:</span> Doctor-patient relationships
                  </li>
                  <li>
                    <span className="font-medium">Cassandra:</span> Analytics with region-based partitioning
                  </li>
                  <li>
                    <span className="font-medium">Redis:</span> Real-time alerts and caching
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-health-secondary mb-2">System Features</h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Strong consistency for patient medical records</li>
                  <li>Eventual consistency for analytics</li>
                  <li>Real-time health monitoring with push notifications</li>
                  <li>Automatic failover with replica sets</li>
                  <li>Region-based data distribution for optimal performance</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationPage;
