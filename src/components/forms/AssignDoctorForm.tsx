
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService } from "@/services/api";

const AssignDoctorForm = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [relationshipType, setRelationshipType] = useState<string>("PRIMARY_CARE");

  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => apiService.getPatient(patientId!),
    enabled: !!patientId,
  });

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: apiService.getAllDoctors,
  });

  const { data: patientDoctors } = useQuery({
    queryKey: ["patient-doctors", patientId],
    queryFn: () => apiService.getPatientDoctors(patientId!),
    enabled: !!patientId,
  });

  const assignDoctorMutation = useMutation({
    mutationFn: () => {
      if (!patientId || !selectedDoctor) return Promise.reject("Missing required data");
      return apiService.assignPatientToDoctor(selectedDoctor, patientId, relationshipType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-doctors", patientId] });
      navigate(`/patients/${patientId}`);
    },
  });

  // Filter out doctors already assigned to the patient
  const availableDoctors = doctors?.filter(
    (doctor) => !patientDoctors?.some((pd) => pd.doctor_id === doctor._id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignDoctorMutation.mutate();
  };

  if (!patientId) {
    return <div>Patient ID is required</div>;
  }

  if (isLoadingPatient || isLoadingDoctors) {
    return <div className="text-center py-6">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Doctor to {patient?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {availableDoctors && availableDoctors.length > 0 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select
                value={selectedDoctor || ""}
                onValueChange={setSelectedDoctor}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {availableDoctors.map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      {doctor.name} ({doctor.specialization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationshipType">Relationship Type</Label>
              <Select
                value={relationshipType}
                onValueChange={setRelationshipType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIMARY_CARE">Primary Care</SelectItem>
                  <SelectItem value="SPECIALIST">Specialist</SelectItem>
                  <SelectItem value="CONSULTING">Consulting</SelectItem>
                </SelectContent>
              </Select>
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
                disabled={!selectedDoctor || assignDoctorMutation.isPending}
              >
                {assignDoctorMutation.isPending ? "Assigning..." : "Assign Doctor"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p>No available doctors to assign. All doctors have been assigned to this patient.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate(`/doctors/new`)}
            >
              Add New Doctor
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignDoctorForm;
