export type RiskLevel = 'Low' | 'Medium' | 'High';

export type PatientStatus = 'Stable' | 'Observation' | 'Critical' | 'Discharge ready';

export type ViewMode = 'grid' | 'list';

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: PatientStatus;
  risk: RiskLevel;
  clinician: string;
  facility: string;
  lastVisit: string;
  nextAction: string;
  vitals: {
    bp: string;
    heartRate: number;
    spo2: number;
  };
};

export type UserSession = {
  uid: string;
  email: string | null;
  displayName: string | null;
  expiresAt: number;
};
