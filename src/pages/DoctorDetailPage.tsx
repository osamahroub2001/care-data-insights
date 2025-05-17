
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  ChevronLeft,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/services/api";

const DoctorDetailPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();

  // Find the doctor
  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: apiService.getAllDoctors,
  });

  const doctor = doctors?.find(d => d._id === doctorId);

  // Fetch doctor's patients
  const { data: patients, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["doctor-patients", doctorId],
    queryFn: () => apiService.getDoctorPatients(doctorId!),
    enabled: !!doctorId,
  });

  if (!doctorId) {
    return <div>Doctor ID is required</div>;
  }

  if (!doctor) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Doctor not found</h1>
        <Button asChild>
          <Link to="/doctors">Back to Doctors</Link>
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
            <div className="h-16 w-16 rounded-full bg-health-secondary/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-health-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{doctor.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary">{doctor.specialization}</Badge>
                <Badge variant="outline">{doctor.region}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assigned Patients</CardTitle>
            <Button asChild size="sm">
              <Link to={`/doctors/${doctorId}/assign-patient`}>Assign Patient</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPatients ? (
            <div className="text-center py-6">Loading patients...</div>
          ) : patients && patients.length > 0 ? (
            <div className="space-y-4">
              {patients.map((patientRel) => (
                <div key={patientRel.patient_id} className="flex items-center justify-between p-4 rounded-md border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{patientRel.patient_name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline">{patientRel.relationship_type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Since {new Date(patientRel.since).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/patients/${patientRel.patient_id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No patients assigned</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This doctor has no patients assigned yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">ID</h3>
              <p className="font-medium truncate">{doctor._id}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Specialization</h3>
              <p className="font-medium">{doctor.specialization}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Region</h3>
              <p className="font-medium">{doctor.region}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Created At</h3>
              <p className="font-medium">{new Date(doctor.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Updated At</h3>
              <p className="font-medium">{new Date(doctor.updated_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Patient Count</h3>
              <p className="font-medium">{patients?.length || 0} patients</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDetailPage;
