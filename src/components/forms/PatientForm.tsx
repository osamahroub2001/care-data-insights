
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Patient, apiService } from "@/services/api";

interface PatientFormProps {
  patient?: Patient;
  mode: "create" | "edit";
}

const PatientForm = ({ patient, mode }: PatientFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<Patient>>({
    name: patient?.name || "",
    age: patient?.age || undefined,
    gender: patient?.gender || "",
    blood_type: patient?.blood_type || "",
    region: patient?.region || "North",
    medical_history: {
      conditions: patient?.medical_history?.conditions || [],
      allergies: patient?.medical_history?.allergies || [],
      surgeries: patient?.medical_history?.surgeries || 0,
    },
  });

  const [conditions, setConditions] = useState<string>(
    (patient?.medical_history?.conditions || []).join(", ")
  );
  const [allergies, setAllergies] = useState<string>(
    (patient?.medical_history?.allergies || []).join(", ")
  );

  const createMutation = useMutation({
    mutationFn: apiService.createPatient,
    onSuccess: (patientId) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      if (patientId) {
        navigate(`/patients/${patientId}`);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; patient: Partial<Patient> }) => 
      apiService.updatePatient(data.id, data.patient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", patient?._id] });
      navigate(`/patients/${patient?._id}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "conditions") {
      setConditions(value);
      return;
    }
    
    if (name === "allergies") {
      setAllergies(value);
      return;
    }
    
    if (name === "surgeries") {
      setFormData({
        ...formData,
        medical_history: {
          ...formData.medical_history!,
          surgeries: parseInt(value) || 0,
        },
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const medicalHistory = {
      conditions: conditions.split(",").map(item => item.trim()).filter(Boolean),
      allergies: allergies.split(",").map(item => item.trim()).filter(Boolean),
      surgeries: formData.medical_history?.surgeries || 0,
    };
    
    const updatedFormData = {
      ...formData,
      medical_history: medicalHistory,
    };
    
    if (mode === "create") {
      createMutation.mutate(updatedFormData);
    } else if (patient?._id) {
      updateMutation.mutate({
        id: patient._id,
        patient: updatedFormData,
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Patient Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                name="region"
                value={formData.region}
                onValueChange={(value) => handleSelectChange("region", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                  <SelectItem value="Central">Central</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age || ""}
                onChange={handleInputChange}
                placeholder="Age in years"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                name="gender"
                value={formData.gender || ""}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_type">Blood Type</Label>
              <Select
                name="blood_type"
                value={formData.blood_type || ""}
                onValueChange={(value) => handleSelectChange("blood_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditions">Medical Conditions (comma separated)</Label>
            <Input
              id="conditions"
              name="conditions"
              value={conditions}
              onChange={handleInputChange}
              placeholder="Hypertension, Diabetes, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies (comma separated)</Label>
            <Input
              id="allergies"
              name="allergies"
              value={allergies}
              onChange={handleInputChange}
              placeholder="Penicillin, Peanuts, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surgeries">Previous Surgeries</Label>
            <Input
              id="surgeries"
              name="surgeries"
              type="number"
              min="0"
              value={formData.medical_history?.surgeries || 0}
              onChange={handleInputChange}
              placeholder="Number of surgeries"
            />
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
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : mode === "create"
                ? "Create Patient"
                : "Update Patient"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientForm;
