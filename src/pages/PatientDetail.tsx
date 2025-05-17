
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Heart,
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  File,
  ChevronLeft,
  Users,
  Edit,
  Thermometer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VitalIndicator } from "@/components/ui/vital-indicator";
import { apiService } from "@/services/api";

const PatientDetail = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch patient details
  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => apiService.getPatient(patientId!),
    enabled: !!patientId,
  });

  // Fetch patient's doctors
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["patient-doctors", patientId],
    queryFn: () => apiService.getPatientDoctors(patientId!),
    enabled: !!patientId,
  });

  // Fetch patient's vitals
  const { data: vitals, isLoading: isLoadingVitals } = useQuery({
    queryKey: ["patient-vitals", patientId],
    queryFn: () => apiService.getVitals(patientId!),
    enabled: !!patientId,
  });

  // Fetch patient's alerts
  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ["patient-alerts", patientId],
    queryFn: () => apiService.getPatientAlerts(patientId!),
    enabled: !!patientId,
  });

  // Get the most recent vital signs
  const latestVitals = vitals && vitals.length > 0 ? vitals[0] : null;

  if (!patientId) {
    return <div>Patient ID is required</div>;
  }

  if (isLoadingPatient) {
    return <div className="p-8 text-center">Loading patient details...</div>;
  }

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Patient not found</h1>
        <Button asChild>
          <Link to="/patients">Back to Patients</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-health-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-health-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="outline">{patient.region}</Badge>
                {patient.gender && <Badge variant="outline">{patient.gender}</Badge>}
                {patient.blood_type && <Badge variant="outline">Blood: {patient.blood_type}</Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/vitals/record/${patientId}`}>
                <Heart className="mr-2 h-4 w-4" />
                Record Vitals
              </Link>
            </Button>
            <Button asChild>
              <Link to={`/patients/${patientId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Patient
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full md:w-fit grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ID</p>
                      <p className="font-medium">{patient._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Region</p>
                      <p className="font-medium">{patient.region}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {patient.age !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="font-medium">{patient.age} years</p>
                      </div>
                    )}
                    {patient.gender && (
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium">{patient.gender}</p>
                      </div>
                    )}
                  </div>
                  {patient.blood_type && (
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Type</p>
                      <p className="font-medium">{patient.blood_type}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-2">Medical Conditions</h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.medical_history?.conditions?.length > 0 ? (
                        patient.medical_history.conditions.map((condition) => (
                          <Badge key={condition} variant="secondary">
                            {condition}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No conditions recorded</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-2">Allergies</h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.medical_history?.allergies?.length > 0 ? (
                        patient.medical_history.allergies.map((allergy) => (
                          <Badge key={allergy} variant="outline">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No allergies recorded</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-2">Previous Surgeries</h3>
                    <p className="font-medium">
                      {patient.medical_history?.surgeries || 0} recorded procedures
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {latestVitals ? (
              <>
                <VitalIndicator
                  name="Heart Rate"
                  value={latestVitals.heart_rate || 0}
                  unit="bpm"
                  min={40}
                  max={140}
                />
                <VitalIndicator
                  name="Blood Pressure (Systolic)"
                  value={latestVitals.blood_pressure_systolic || 0}
                  unit="mmHg"
                  min={90}
                  max={180}
                />
                <VitalIndicator
                  name="Temperature"
                  value={latestVitals.temperature || 0}
                  unit="°C"
                  min={35}
                  max={39}
                />
                <VitalIndicator
                  name="Oxygen Level"
                  value={latestVitals.oxygen_level || 0}
                  unit="%"
                  min={88}
                  max={100}
                />
              </>
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Heart className="h-8 w-8 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-center">No vital signs recorded yet</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Record vital signs to monitor this patient's health
                  </p>
                  <Button asChild>
                    <Link to={`/vitals/record/${patientId}`}>Record Vitals</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingVitals ? (
                <div className="text-center py-6">Loading vital signs...</div>
              ) : vitals && vitals.length > 0 ? (
                <div className="space-y-6">
                  {vitals.map((vital, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(vital.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <Badge variant="outline">{vital.region}</Badge>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {vital.heart_rate !== undefined && (
                          <div className="p-3 rounded-md border">
                            <div className="flex items-center gap-2 mb-1">
                              <Heart className="h-4 w-4 text-health-primary" />
                              <span className="text-sm font-medium">Heart Rate</span>
                            </div>
                            <div className="text-xl font-bold">{vital.heart_rate} <span className="text-xs text-muted-foreground">bpm</span></div>
                          </div>
                        )}
                        {vital.blood_pressure_systolic !== undefined && (
                          <div className="p-3 rounded-md border">
                            <div className="flex items-center gap-2 mb-1">
                              <Activity className="h-4 w-4 text-health-secondary" />
                              <span className="text-sm font-medium">Blood Pressure</span>
                            </div>
                            <div className="text-xl font-bold">
                              {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic || '--'} <span className="text-xs text-muted-foreground">mmHg</span>
                            </div>
                          </div>
                        )}
                        {vital.temperature !== undefined && (
                          <div className="p-3 rounded-md border">
                            <div className="flex items-center gap-2 mb-1">
                              <Thermometer className="h-4 w-4 text-health-warning" />
                              <span className="text-sm font-medium">Temperature</span>
                            </div>
                            <div className="text-xl font-bold">{vital.temperature} <span className="text-xs text-muted-foreground">°C</span></div>
                          </div>
                        )}
                        {vital.oxygen_level !== undefined && (
                          <div className="p-3 rounded-md border">
                            <div className="flex items-center gap-2 mb-1">
                              <Activity className="h-4 w-4 text-health-good" />
                              <span className="text-sm font-medium">Oxygen Level</span>
                            </div>
                            <div className="text-xl font-bold">{vital.oxygen_level} <span className="text-xs text-muted-foreground">%</span></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No vital signs recorded</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start recording vital signs to track this patient's health
                  </p>
                  <Button asChild>
                    <Link to={`/vitals/record/${patientId}`}>Record Vitals</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assigned Doctors</CardTitle>
              <Button asChild size="sm">
                <Link to={`/patients/${patientId}/assign-doctor`}>Assign Doctor</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingDoctors ? (
                <div className="text-center py-6">Loading doctors...</div>
              ) : doctors && doctors.length > 0 ? (
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.doctor_id} className="flex items-center justify-between p-4 rounded-md border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-health-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-health-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{doctor.doctor_name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Badge variant="secondary">{doctor.specialization}</Badge>
                            <Badge variant="outline">{doctor.relationship_type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Since {new Date(doctor.since).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No doctors assigned</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assign doctors to manage this patient's care
                  </p>
                  <Button asChild>
                    <Link to={`/patients/${patientId}/assign-doctor`}>Assign Doctor</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAlerts ? (
                <div className="text-center py-6">Loading alerts...</div>
              ) : alerts && alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert, alertIndex) => (
                    <div key={alertIndex} className="border rounded-md overflow-hidden">
                      <div className="bg-health-critical/10 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-health-critical/20 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-health-critical" />
                          </div>
                          <div>
                            <div className="font-medium">Alert for {alert.patient_name}</div>
                            <div className="text-sm text-muted-foreground">
                              Status: <Badge variant={alert.status === "new" ? "destructive" : "outline"}>{alert.status}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <div className="space-y-3">
                          {alert.alerts.map((alertDetail, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {alertDetail.vital.includes("heart") ? (
                                    <Heart className="h-4 w-4 text-health-critical" />
                                  ) : alertDetail.vital.includes("blood") ? (
                                    <Activity className="h-4 w-4 text-health-critical" />
                                  ) : alertDetail.vital.includes("temperature") ? (
                                    <Thermometer className="h-4 w-4 text-health-critical" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-health-critical" />
                                  )}
                                  <span className="font-medium">{alertDetail.vital.replaceAll("_", " ")}</span>
                                </div>
                                <Badge variant="destructive">Abnormal</Badge>
                              </div>
                              <div className="text-lg font-bold">
                                {alertDetail.value} <span className="text-xs text-muted-foreground">
                                  {alertDetail.vital.includes("heart") ? "bpm" : alertDetail.vital.includes("blood") ? "mmHg" : alertDetail.vital.includes("temperature") ? "°C" : "%"}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Normal range: {alertDetail.threshold_min}-{alertDetail.threshold_max} {alertDetail.vital.includes("heart") ? "bpm" : alertDetail.vital.includes("blood") ? "mmHg" : alertDetail.vital.includes("temperature") ? "°C" : "%"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No alerts found</h3>
                  <p className="text-sm text-muted-foreground">
                    The patient has no active health alerts at the moment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
