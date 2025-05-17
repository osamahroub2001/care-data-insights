
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PatientForm from "@/components/forms/PatientForm";

const NewPatientPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" className="mb-4" asChild>
          <Link to="/patients">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add New Patient</h1>
        <p className="text-muted-foreground">
          Create a new patient record in the system.
        </p>
      </div>
      <PatientForm mode="create" />
    </div>
  );
};

export default NewPatientPage;
