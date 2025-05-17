
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService } from "@/services/api";

const AnalyticsPage = () => {
  const [period, setPeriod] = useState<string>("hourly");
  const [limit, setLimit] = useState<number>(24);

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: apiService.getAllPatients,
  });

  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: apiService.getAllDoctors,
  });

  // Calculate region distribution
  const regionDistribution = patients?.reduce((acc: Record<string, number>, patient) => {
    const region = patient.region || "Unknown";
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});

  const regionData = regionDistribution
    ? Object.entries(regionDistribution).map(([name, value]) => ({ name, value }))
    : [];

  // Calculate conditions distribution
  const conditionsMap: Record<string, number> = {};
  patients?.forEach((patient) => {
    patient.medical_history?.conditions?.forEach((condition) => {
      conditionsMap[condition] = (conditionsMap[condition] || 0) + 1;
    });
  });

  const conditionsData = Object.entries(conditionsMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Specialization distribution
  const specializationMap: Record<string, number> = {};
  doctors?.forEach((doctor) => {
    const spec = doctor.specialization || "Unknown";
    specializationMap[spec] = (specializationMap[spec] || 0) + 1;
  });

  const specializationData = Object.entries(specializationMap)
    .map(([name, value]) => ({ name, value }));

  // Mock data for vital signs trends
  const vitalsTrendData = [
    {
      time: "00:00",
      "Heart Rate": 72,
      "Blood Pressure": 120,
      "Oxygen Level": 98,
      "Temperature": 36.6,
    },
    {
      time: "03:00",
      "Heart Rate": 68,
      "Blood Pressure": 118,
      "Oxygen Level": 97,
      "Temperature": 36.5,
    },
    {
      time: "06:00",
      "Heart Rate": 65,
      "Blood Pressure": 115,
      "Oxygen Level": 97,
      "Temperature": 36.4,
    },
    {
      time: "09:00",
      "Heart Rate": 70,
      "Blood Pressure": 122,
      "Oxygen Level": 98,
      "Temperature": 36.7,
    },
    {
      time: "12:00",
      "Heart Rate": 76,
      "Blood Pressure": 125,
      "Oxygen Level": 99,
      "Temperature": 36.9,
    },
    {
      time: "15:00",
      "Heart Rate": 78,
      "Blood Pressure": 123,
      "Oxygen Level": 98,
      "Temperature": 37.0,
    },
    {
      time: "18:00",
      "Heart Rate": 75,
      "Blood Pressure": 121,
      "Oxygen Level": 98,
      "Temperature": 36.8,
    },
    {
      time: "21:00",
      "Heart Rate": 71,
      "Blood Pressure": 119,
      "Oxygen Level": 97,
      "Temperature": 36.7,
    },
  ];

  const COLORS = ['#4F46E5', '#8B5CF6', '#A7F3D0', '#F59E0B', '#EF4444', '#10B981', '#6366F1'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            System-wide analytics and insights.
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={period} onValueChange={(value) => setPeriod(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={limit.toString()}
            onValueChange={(value) => setLimit(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">Last 12</SelectItem>
              <SelectItem value="24">Last 24</SelectItem>
              <SelectItem value="48">Last 48</SelectItem>
              <SelectItem value="72">Last 72</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vital Signs Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Heart Rate"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Blood Pressure"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="Oxygen Level"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="Temperature"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Medical Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conditionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Patients" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} patients`, `${props.payload.name}`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={specializationData}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Doctors" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
