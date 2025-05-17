
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VitalsForm from "@/components/forms/VitalsForm";
import { apiService } from "@/services/api";

const RecordVitalsPage = () => {
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
            Back to {patient.name}
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Record Vital Signs</h1>
        <p className="text-muted-foreground">
          Record vital signs for {patient.name}.
        </p>
      </div>
      <VitalsForm />
    </div>
  );
};

export default RecordVitalsPage;
