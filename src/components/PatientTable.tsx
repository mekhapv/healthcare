import type { Patient } from '../types';

type PatientTableProps = {
  patients: Patient[];
  selectedPatientId: string;
  onSelect: (id: string) => void;
};

export function PatientTable({ patients, selectedPatientId, onSelect }: PatientTableProps) {
  return (
    <div className="table-wrap">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Condition</th>
            <th>Status</th>
            <th>Risk</th>
            <th>Clinician</th>
            <th>Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className={selectedPatientId === patient.id ? 'selected-row' : ''}
              onClick={() => onSelect(patient.id)}
            >
              <td>
                <strong>{patient.name}</strong>
                <span>{patient.id}</span>
              </td>
              <td>{patient.condition}</td>
              <td>{patient.status}</td>
              <td>{patient.risk}</td>
              <td>{patient.clinician}</td>
              <td>{patient.lastVisit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
