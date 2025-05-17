
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  Heart, 
  Activity, 
  AlertTriangle,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Patient, apiService } from "@/services/api";

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: patients, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: apiService.getAllPatients,
  });

  // Filter patients based on search term
  const filteredPatients = patients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medical_history?.conditions?.some(condition => 
      condition.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (conditions: string[]) => {
    const criticalConditions = ["Heart Disease", "Cancer", "COPD"];
    const warningConditions = ["Hypertension", "Diabetes"];
    
    if (conditions.some(c => criticalConditions.includes(c))) {
      return "bg-health-critical/10 text-health-critical";
    }
    
    if (conditions.some(c => warningConditions.includes(c))) {
      return "bg-health-warning/10 text-health-warning";
    }
    
    return "bg-health-good/10 text-health-good";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient records and monitor their health status.
          </p>
        </div>
        <Button asChild>
          <Link to="/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, region or condition..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <div>Loading patients...</div>
            </div>
          ) : filteredPatients && filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medical Conditions</TableHead>
                  <TableHead>Allergies</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {patient._id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.medical_history?.conditions?.length > 0 ? (
                          patient.medical_history.conditions.map((condition) => (
                            <Badge 
                              key={condition} 
                              variant="secondary"
                              className={getStatusColor([condition])}
                            >
                              {condition}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.medical_history?.allergies?.length > 0 ? (
                          patient.medical_history.allergies.map((allergy) => (
                            <Badge key={allergy} variant="outline">
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.region}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {patient.medical_history?.conditions?.includes("Heart Disease") ? (
                          <Heart className="h-4 w-4 text-health-critical" />
                        ) : patient.medical_history?.conditions?.includes("Hypertension") ? (
                          <Activity className="h-4 w-4 text-health-warning" />
                        ) : (
                          <Activity className="h-4 w-4 text-health-good" />
                        )}
                        <span className={
                          patient.medical_history?.conditions?.includes("Heart Disease") 
                            ? "text-health-critical" 
                            : patient.medical_history?.conditions?.includes("Hypertension")
                            ? "text-health-warning"
                            : "text-health-good"
                        }>
                          {patient.medical_history?.conditions?.includes("Heart Disease") 
                            ? "Critical" 
                            : patient.medical_history?.conditions?.includes("Hypertension")
                            ? "Caution"
                            : "Stable"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/vitals?patient=${patient._id}`}>
                            <Heart className="h-4 w-4 mr-1" />
                            Vitals
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to={`/patients/${patient._id}`}>View</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No patients found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search" : "Add a new patient to get started"}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link to="/patients/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Patient
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsPage;
