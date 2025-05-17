
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Heart, 
  Activity, 
  Calendar, 
  Clock,
  User,
  AlertTriangle,
  ChevronDown,
  Plus,
  Thermometer
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VitalIndicator } from "@/components/ui/vital-indicator";
import { apiService } from "@/services/api";

const VitalsPage = () => {
  const [searchParams] = useSearchParams();
  const selectedPatientId = searchParams.get("patient");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(selectedPatientId);
  const [timeRange, setTimeRange] = useState("24h");

  // Fetch all patients
  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: apiService.getAllPatients,
  });

  // Fetch vitals for selected patient
  const { data: patientVitals, isLoading: isLoadingVitals } = useQuery({
    queryKey: ["patientVitals", selectedPatient, timeRange],
    queryFn: () => apiService.getVitals(selectedPatient!),
    enabled: !!selectedPatient,
  });

  // Calculate time range for the query
  const getTimeRangeParams = () => {
    const now = new Date();
    let startTime;

    switch (timeRange) {
      case "12h":
        startTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        break;
      case "48h":
        startTime = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        break;
      case "7d":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default: // 24h
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return {
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
    };
  };

  // Format chart data
  const formatChartData = () => {
    if (!patientVitals) return [];
    
    return patientVitals.map((vital) => {
      const timestamp = new Date(vital.timestamp);
      return {
        timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTimestamp: timestamp,
        heart_rate: vital.heart_rate,
        blood_pressure_systolic: vital.blood_pressure_systolic,
        blood_pressure_diastolic: vital.blood_pressure_diastolic,
        temperature: vital.temperature,
        oxygen_level: vital.oxygen_level,
      };
    });
  };

  const chartData = formatChartData();

  // Get the most recent vital signs
  const latestVitals = patientVitals && patientVitals.length > 0 ? patientVitals[0] : null;

  const calculateAverage = (property: string) => {
    if (!patientVitals || patientVitals.length === 0) return "N/A";
    
    const values = patientVitals.filter((v: any) => v[property] !== undefined).map((v: any) => v[property]);
    if (values.length === 0) return "N/A";
    
    const sum = values.reduce((a: number, b: number) => a + b, 0);
    const avg = sum / values.length;
    return avg.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vital Signs</h1>
          <p className="text-muted-foreground">
            Monitor and track patient vital signs over time.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={selectedPatient || ""}
            onValueChange={(value) => setSelectedPatient(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients?.map((patient) => (
                <SelectItem key={patient._id} value={patient._id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">Last 12h</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="48h">Last 48h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
            </SelectContent>
          </Select>
          {selectedPatient && (
            <Button asChild>
              <Link to={`/vitals/record/${selectedPatient}`}>
                <Plus className="mr-2 h-4 w-4" />
                Record Vitals
              </Link>
            </Button>
          )}
        </div>
      </div>

      {!selectedPatient ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-health-primary/50 mb-4" />
            <h3 className="text-lg font-medium">Select a patient to view vital signs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose a patient from the dropdown above to monitor their vitals
            </p>
            <Button asChild>
              <Link to="/patients">Browse Patients</Link>
            </Button>
          </CardContent>
        </Card>
      ) : isLoadingVitals ? (
        <div className="text-center py-6">Loading vital signs...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-5 w-5 text-health-primary" />
                  <h3 className="font-medium">Heart Rate</h3>
                </div>
                <div className="text-3xl font-bold">{calculateAverage("heart_rate")}</div>
                <p className="text-muted-foreground text-sm">Average bpm</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-5 w-5 text-health-secondary" />
                  <h3 className="font-medium">Blood Pressure</h3>
                </div>
                <div className="text-3xl font-bold">
                  {calculateAverage("blood_pressure_systolic")}/{calculateAverage("blood_pressure_diastolic")}
                </div>
                <p className="text-muted-foreground text-sm">Average mmHg</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Thermometer className="h-5 w-5 text-health-warning" />
                  <h3 className="font-medium">Temperature</h3>
                </div>
                <div className="text-3xl font-bold">{calculateAverage("temperature")}</div>
                <p className="text-muted-foreground text-sm">Average °C</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-5 w-5 text-health-good" />
                  <h3 className="font-medium">Oxygen Level</h3>
                </div>
                <div className="text-3xl font-bold">{calculateAverage("oxygen_level")}</div>
                <p className="text-muted-foreground text-sm">Average %</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="charts">
            <TabsList className="grid w-full md:w-fit grid-cols-2">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="table">Data Table</TabsTrigger>
            </TabsList>
            
            <TabsContent value="charts" className="space-y-4">
              {chartData.length > 0 ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Heart Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="timestamp" 
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                              domain={[30, 160]}
                              label={{ value: 'BPM', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                            />
                            <Tooltip 
                              formatter={(value, name) => [`${value} bpm`, 'Heart Rate']}
                              labelFormatter={(label) => `Time: ${label}`}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="heart_rate" 
                              stroke="#4F46E5" 
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Blood Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="timestamp" 
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                              domain={[40, 200]}
                              label={{ value: 'mmHg', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                            />
                            <Tooltip 
                              formatter={(value, name) => [
                                `${value} mmHg`, 
                                name === "blood_pressure_systolic" ? "Systolic" : "Diastolic"
                              ]}
                              labelFormatter={(label) => `Time: ${label}`}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="blood_pressure_systolic" 
                              name="Systolic"
                              stroke="#8B5CF6" 
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="blood_pressure_diastolic" 
                              name="Diastolic"
                              stroke="#A7F3D0" 
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Temperature</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="timestamp" 
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis 
                                domain={[34, 42]}
                                label={{ value: '°C', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                              />
                              <Tooltip 
                                formatter={(value, name) => [`${value} °C`, 'Temperature']}
                                labelFormatter={(label) => `Time: ${label}`}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="temperature" 
                                stroke="#F59E0B" 
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Oxygen Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="timestamp" 
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis 
                                domain={[80, 100]}
                                label={{ value: '%', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                              />
                              <Tooltip 
                                formatter={(value, name) => [`${value}%`, 'Oxygen Level']}
                                labelFormatter={(label) => `Time: ${label}`}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="oxygen_level" 
                                stroke="#10B981" 
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No vital signs data available</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Record vital signs for this patient to see charts
                    </p>
                    <Button asChild>
                      <Link to={`/vitals/record/${selectedPatient}`}>Record Vitals</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs History</CardTitle>
                </CardHeader>
                <CardContent>
                  {patientVitals && patientVitals.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="py-3 px-4 text-left font-medium">Timestamp</th>
                            <th className="py-3 px-4 text-left font-medium">Heart Rate</th>
                            <th className="py-3 px-4 text-left font-medium">Blood Pressure</th>
                            <th className="py-3 px-4 text-left font-medium">Temperature</th>
                            <th className="py-3 px-4 text-left font-medium">Oxygen Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientVitals.map((vital, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                              <td className="py-3 px-4">
                                {new Date(vital.timestamp).toLocaleString()}
                              </td>
                              <td className="py-3 px-4">
                                {vital.heart_rate !== undefined ? `${vital.heart_rate} bpm` : "-"}
                              </td>
                              <td className="py-3 px-4">
                                {vital.blood_pressure_systolic !== undefined && vital.blood_pressure_diastolic !== undefined
                                  ? `${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic} mmHg`
                                  : vital.blood_pressure_systolic !== undefined
                                  ? `${vital.blood_pressure_systolic}/-- mmHg`
                                  : "-"}
                              </td>
                              <td className="py-3 px-4">
                                {vital.temperature !== undefined ? `${vital.temperature} °C` : "-"}
                              </td>
                              <td className="py-3 px-4">
                                {vital.oxygen_level !== undefined ? `${vital.oxygen_level}%` : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No vital signs data available</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Record vital signs for this patient to view data
                      </p>
                      <Button asChild>
                        <Link to={`/vitals/record/${selectedPatient}`}>Record Vitals</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default VitalsPage;
