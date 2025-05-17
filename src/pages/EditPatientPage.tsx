
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PatientForm from "@/components/forms/PatientForm";
import { apiService } from "@/services/api";

const EditPatientPage = () => {
  const { patientId } = useParams<{ patientId: string }>();

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => apiService.getPatient(patientId!),
    enabled: !!patientId,
  });

  if (isLoading) {
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
        <Button variant="ghost" className="mb-4" asChild>
          <Link to={`/patients/${patientId}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Patient
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Patient</h1>
        <p className="text-muted-foreground">
          Update patient information.
        </p>
      </div>
      <PatientForm patient={patient} mode="edit" />
    </div>
  );
};

export default EditPatientPage;
