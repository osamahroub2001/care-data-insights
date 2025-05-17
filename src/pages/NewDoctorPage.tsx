
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DoctorForm from "@/components/forms/DoctorForm";

const NewDoctorPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" className="mb-4" asChild>
          <Link to="/doctors">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Doctors
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add New Doctor</h1>
        <p className="text-muted-foreground">
          Create a new doctor record in the system.
        </p>
      </div>
      <DoctorForm mode="create" />
    </div>
  );
};

export default NewDoctorPage;
