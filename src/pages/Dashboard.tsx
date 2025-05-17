
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Activity, User, Users, Heart, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";

const Dashboard = () => {
  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: apiService.getAllPatients,
  });

  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: apiService.getAllDoctors,
  });

  // Get the first 5 patients to show in recent patients list
  const recentPatients = patients?.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the healthcare monitoring system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild>
            <Link to="/patients/new">Add New Patient</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={patients?.length || 0}
          icon={<User className="h-5 w-5" />}
          iconColor="bg-health-primary/10 text-health-primary"
        />
        <StatCard
          title="Total Doctors"
          value={doctors?.length || 0}
          icon={<Users className="h-5 w-5" />}
          iconColor="bg-health-secondary/10 text-health-secondary"
        />
        <StatCard
          title="Active Alerts"
          value={3}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconColor="bg-health-critical/10 text-health-critical"
        />
        <StatCard
          title="Avg. Heart Rate"
          value="78 bpm"
          icon={<Heart className="h-5 w-5" />}
          iconColor="bg-health-accent/10 text-health-primary"
          change={{
            value: 3,
            positive: false,
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentPatients && recentPatients.length > 0 ? (
                recentPatients.map((patient) => (
                  <div
                    key={patient._id}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-health-primary/10 text-health-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {patient.medical_history?.conditions?.join(", ") || "No conditions"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" asChild>
                      <Link to={`/patients/${patient._id}`}>View</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No patients found. Add some patients to get started.
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/patients">View All Patients</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-health-good"></div>
                  <span>MongoDB</span>
                </div>
                <span className="text-xs bg-health-good/10 text-health-good font-medium py-1 px-2 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-health-good"></div>
                  <span>InfluxDB</span>
                </div>
                <span className="text-xs bg-health-good/10 text-health-good font-medium py-1 px-2 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-health-good"></div>
                  <span>Neo4j</span>
                </div>
                <span className="text-xs bg-health-good/10 text-health-good font-medium py-1 px-2 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-health-good"></div>
                  <span>Cassandra</span>
                </div>
                <span className="text-xs bg-health-good/10 text-health-good font-medium py-1 px-2 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-health-good"></div>
                  <span>Redis</span>
                </div>
                <span className="text-xs bg-health-good/10 text-health-good font-medium py-1 px-2 rounded-full">
                  Operational
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/simulation">Run Simulation</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
