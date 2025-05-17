
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";

const VitalsForm = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    heart_rate: "",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    temperature: "",
    oxygen_level: "",
    timestamp: new Date().toISOString().substring(0, 16),
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => apiService.getPatient(patientId!),
    enabled: !!patientId,
  });

  const recordVitalsMutation = useMutation({
    mutationFn: () => {
      if (!patientId) return Promise.reject("No patient ID");
      
      const vitals: Record<string, any> = {};
      
      if (formData.heart_rate) vitals.heart_rate = Number(formData.heart_rate);
      if (formData.blood_pressure_systolic) vitals.blood_pressure_systolic = Number(formData.blood_pressure_systolic);
      if (formData.blood_pressure_diastolic) vitals.blood_pressure_diastolic = Number(formData.blood_pressure_diastolic);
      if (formData.temperature) vitals.temperature = Number(formData.temperature);
      if (formData.oxygen_level) vitals.oxygen_level = Number(formData.oxygen_level);
      if (formData.timestamp) vitals.timestamp = new Date(formData.timestamp).toISOString();
      
      return apiService.recordVitals(patientId, vitals);
    },
    onSuccess: () => {
      navigate(`/patients/${patientId}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordVitalsMutation.mutate();
  };

  if (!patientId) {
    return <div>Patient ID is required</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Vital Signs for {patient?.name || "Patient"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
              <Input
                id="heart_rate"
                name="heart_rate"
                type="number"
                value={formData.heart_rate}
                onChange={handleInputChange}
                placeholder="e.g., 72"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oxygen_level">Oxygen Level (%)</Label>
              <Input
                id="oxygen_level"
                name="oxygen_level"
                type="number"
                min="0"
                max="100"
                value={formData.oxygen_level}
                onChange={handleInputChange}
                placeholder="e.g., 98"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="blood_pressure_systolic">Blood Pressure (Systolic)</Label>
              <Input
                id="blood_pressure_systolic"
                name="blood_pressure_systolic"
                type="number"
                value={formData.blood_pressure_systolic}
                onChange={handleInputChange}
                placeholder="e.g., 120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_pressure_diastolic">Blood Pressure (Diastolic)</Label>
              <Input
                id="blood_pressure_diastolic"
                name="blood_pressure_diastolic"
                type="number"
                value={formData.blood_pressure_diastolic}
                onChange={handleInputChange}
                placeholder="e.g., 80"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={handleInputChange}
                placeholder="e.g., 36.6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timestamp">Timestamp</Label>
              <Input
                id="timestamp"
                name="timestamp"
                type="datetime-local"
                value={formData.timestamp}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={recordVitalsMutation.isPending}
            >
              {recordVitalsMutation.isPending ? "Recording..." : "Record Vitals"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VitalsForm;
