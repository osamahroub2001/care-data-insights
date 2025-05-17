
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/PatientsPage";
import PatientDetail from "./pages/PatientDetail";
import NewPatientPage from "./pages/NewPatientPage";
import EditPatientPage from "./pages/EditPatientPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import NewDoctorPage from "./pages/NewDoctorPage";
import VitalsPage from "./pages/VitalsPage";
import RecordVitalsPage from "./pages/RecordVitalsPage";
import AlertsPage from "./pages/AlertsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SimulationPage from "./pages/SimulationPage";
import AssignDoctorPage from "./pages/AssignDoctorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/new" element={<NewPatientPage />} />
            <Route path="/patients/:patientId" element={<PatientDetail />} />
            <Route path="/patients/:patientId/edit" element={<EditPatientPage />} />
            <Route path="/patients/:patientId/assign-doctor" element={<AssignDoctorPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/new" element={<NewDoctorPage />} />
            <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
            <Route path="/vitals" element={<VitalsPage />} />
            <Route path="/vitals/record/:patientId" element={<RecordVitalsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
