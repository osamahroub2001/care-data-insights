
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api";

export interface Patient {
  _id: string;
  name: string;
  age?: number;
  gender?: string;
  blood_type?: string;
  medical_history: {
    conditions: string[];
    allergies: string[];
    surgeries: number;
  };
  region: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  region: string;
  created_at: string;
  updated_at: string;
}

export interface VitalSign {
  timestamp: string;
  patient_id: string;
  region: string;
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  temperature?: number;
  oxygen_level?: number;
}

export interface Alert {
  patient_id: string;
  patient_name: string;
  alerts: {
    vital: string;
    value: number;
    threshold_min: number;
    threshold_max: number;
    timestamp: string;
  }[];
  status: string;
  created_at: string;
}

export interface PatientDoctor {
  doctor_id: string;
  doctor_name: string;
  specialization: string;
  relationship_type: string;
  since: string;
}

export interface DoctorPatient {
  patient_id: string;
  patient_name: string;
  relationship_type: string;
  since: string;
}

export interface Analytics {
  region: string;
  patient_id: string;
  timestamp: string;
  heart_rate_avg?: number;
  blood_pressure_systolic_avg?: number;
  blood_pressure_diastolic_avg?: number;
  temperature_avg?: number;
  oxygen_level_avg?: number;
  analysis_period: string;
}

const handleErrors = (response: Response) => {
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
};

export const apiService = {
  // Patients
  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`);
      const data = await handleErrors(response);
      return data.success ? data.patients : [];
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
      return [];
    }
  },

  async getPatient(id: string): Promise<Patient | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`);
      const data = await handleErrors(response);
      return data.success ? data.patient : null;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      toast.error("Failed to fetch patient details");
      return null;
    }
  },

  async createPatient(patientData: Partial<Patient>): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
      const data = await handleErrors(response);
      if (data.success) {
        toast.success("Patient created successfully");
        return data.patient_id;
      }
      return null;
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("Failed to create patient");
      return null;
    }
  },

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
      const data = await handleErrors(response);
      if (data.success) {
        toast.success("Patient updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      toast.error("Failed to update patient");
      return false;
    }
  },

  // Doctors
  async getAllDoctors(): Promise<Doctor[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`);
      const data = await handleErrors(response);
      return data.success ? data.doctors : [];
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors");
      return [];
    }
  },

  async createDoctor(doctorData: Partial<Doctor>): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });
      const data = await handleErrors(response);
      if (data.success) {
        toast.success("Doctor created successfully");
        return data.doctor_id;
      }
      return null;
    } catch (error) {
      console.error("Error creating doctor:", error);
      toast.error("Failed to create doctor");
      return null;
    }
  },

  async assignPatientToDoctor(
    doctorId: string,
    patientId: string,
    relationshipType: string = "PRIMARY_CARE"
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/patients/${patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relationship_type: relationshipType }),
      });
      const data = await handleErrors(response);
      if (data.success) {
        toast.success("Patient assigned to doctor successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error assigning patient ${patientId} to doctor ${doctorId}:`, error);
      toast.error("Failed to assign patient to doctor");
      return false;
    }
  },

  async getDoctorPatients(doctorId: string): Promise<DoctorPatient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/patients`);
      const data = await handleErrors(response);
      return data.success ? data.patients : [];
    } catch (error) {
      console.error(`Error fetching patients for doctor ${doctorId}:`, error);
      toast.error("Failed to fetch doctor's patients");
      return [];
    }
  },

  async getPatientDoctors(patientId: string): Promise<PatientDoctor[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/doctors`);
      const data = await handleErrors(response);
      return data.success ? data.doctors : [];
    } catch (error) {
      console.error(`Error fetching doctors for patient ${patientId}:`, error);
      toast.error("Failed to fetch patient's doctors");
      return [];
    }
  },

  // Vital Signs
  async recordVitals(
    patientId: string,
    vitals: {
      heart_rate?: number;
      blood_pressure_systolic?: number;
      blood_pressure_diastolic?: number;
      temperature?: number;
      oxygen_level?: number;
      timestamp?: string;
    }
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/vitals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vitals),
      });
      const data = await handleErrors(response);
      if (data.success) {
        toast.success("Vital signs recorded successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error recording vitals for patient ${patientId}:`, error);
      toast.error("Failed to record vital signs");
      return false;
    }
  },

  async getVitals(
    patientId: string,
    startTime?: string,
    endTime?: string
  ): Promise<VitalSign[]> {
    try {
      let url = `${API_BASE_URL}/patients/${patientId}/vitals`;
      const params = new URLSearchParams();
      
      if (startTime) params.append("start_time", startTime);
      if (endTime) params.append("end_time", endTime);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await handleErrors(response);
      return data.success ? data.vitals : [];
    } catch (error) {
      console.error(`Error fetching vitals for patient ${patientId}:`, error);
      toast.error("Failed to fetch vital signs");
      return [];
    }
  },

  // Analytics
  async getAnalytics(
    patientId: string,
    period: string = "hourly",
    limit: number = 24
  ): Promise<Analytics[]> {
    try {
      const url = `${API_BASE_URL}/patients/${patientId}/analytics?period=${period}&limit=${limit}`;
      const response = await fetch(url);
      const data = await handleErrors(response);
      return data.success ? data.analytics : [];
    } catch (error) {
      console.error(`Error fetching analytics for patient ${patientId}:`, error);
      toast.error("Failed to fetch analytics");
      return [];
    }
  },

  // Alerts
  async getPatientAlerts(patientId: string): Promise<Alert[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/alerts`);
      const data = await handleErrors(response);
      return data.success ? data.alerts : [];
    } catch (error) {
      console.error(`Error fetching alerts for patient ${patientId}:`, error);
      toast.error("Failed to fetch alerts");
      return [];
    }
  },

  async resolveAlert(alertId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/resolve`, {
        method: "POST",
      });
      const data = await handleErrors(response);
      if (data.success) {
        toast.success("Alert resolved successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error resolving alert ${alertId}:`, error);
      toast.error("Failed to resolve alert");
      return false;
    }
  },

  // Simulation
  async simulateData(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulate/data`, {
        method: "POST",
      });
      const data = await handleErrors(response);
      if (data.success) {
        toast.success("Data simulation completed");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error simulating data:", error);
      toast.error("Failed to simulate data");
      return false;
    }
  },

  async simulateFailure(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulate/failure`, {
        method: "POST",
      });
      const data = await handleErrors(response);
      if (data.success) {
        toast.success("Failure simulation completed");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error simulating failure:", error);
      toast.error("Failed to simulate failure");
      return false;
    }
  },
};
