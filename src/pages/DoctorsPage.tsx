
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  Users,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiService } from "@/services/api";

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: apiService.getAllDoctors,
  });

  // Filter doctors based on search term
  const filteredDoctors = doctors?.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground">
            Manage doctors and their patient assignments.
          </p>
        </div>
        <Button asChild>
          <Link to="/doctors/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Doctor
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, specialization or region..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <div>Loading doctors...</div>
            </div>
          ) : filteredDoctors && filteredDoctors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-health-secondary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-health-secondary" />
                        </div>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {doctor._id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doctor.specialization}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doctor.region}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(doctor.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/doctors/${doctor._id}/patients`}>
                            <User className="h-4 w-4 mr-1" />
                            Patients
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to={`/doctors/${doctor._id}`}>View</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No doctors found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search" : "Add a new doctor to get started"}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link to="/doctors/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Doctor
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsPage;
