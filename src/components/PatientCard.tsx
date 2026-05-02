import type { Patient } from '../types';

type PatientCardProps = {
  patient: Patient;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function PatientCard({ patient, selected, onSelect }: PatientCardProps) {
  return (
    <button
      type="button"
      className={`patient-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(patient.id)}
    >
      <span className={`risk-dot ${patient.risk.toLowerCase()}`} />
      <div className="patient-card-head">
        <div>
          <strong>{patient.name}</strong>
          <span>{patient.id}</span>
        </div>
        <small className={`status-badge ${patient.status.toLowerCase().replaceAll(' ', '-')}`}>
          {patient.status}
        </small>
      </div>
      <p>{patient.condition}</p>
      <div className="patient-meta">
        <span>{patient.age} yrs</span>
        <span>{patient.facility}</span>
      </div>
      <div className="vital-row">
        <span>BP {patient.vitals.bp}</span>
        <span>HR {patient.vitals.heartRate}</span>
        <span>SpO2 {patient.vitals.spo2}%</span>
      </div>
    </button>
  );
}
