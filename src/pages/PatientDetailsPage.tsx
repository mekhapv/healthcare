import { useEffect, useState } from 'react';
import { CalendarClock, Stethoscope, UserRoundCheck, X } from 'lucide-react';
import { PatientCard } from '../components/PatientCard';
import { PatientTable } from '../components/PatientTable';
import { ViewToggle } from '../components/ViewToggle';
import { useAppStore } from '../store/appStore';

export function PatientDetailsPage() {
  const patients = useAppStore((state) => state.patients);
  const selectedPatientId = useAppStore((state) => state.selectedPatientId);
  const setSelectedPatient = useAppStore((state) => state.setSelectedPatient);
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDetailOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const openPatientRecord = (id: string) => {
    setSelectedPatient(id);
    setIsDetailOpen(true);
  };

  return (
    <div className="patient-page">
      <section className="panel patient-directory">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Patient details</p>
            <h2>Care roster</h2>
          </div>
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>

        {viewMode === 'grid' ? (
          <div className="patient-grid">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                selected={patient.id === selectedPatient.id}
                onSelect={openPatientRecord}
              />
            ))}
          </div>
        ) : (
          <PatientTable
            patients={patients}
            selectedPatientId={selectedPatient.id}
            onSelect={openPatientRecord}
          />
        )}
      </section>

      {isDetailOpen && (
        <div className="modal-backdrop" onClick={() => setIsDetailOpen(false)}>
          <section
            className="patient-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="patient-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="icon-button modal-close"
              type="button"
              aria-label="Close patient record"
              onClick={() => setIsDetailOpen(false)}
            >
              <X size={18} />
            </button>

            <div className="detail-panel">
              <div className="patient-avatar">{selectedPatient.name.slice(0, 1)}</div>
              <h2 id="patient-modal-title">{selectedPatient.name}</h2>
              <p>
                {selectedPatient.id} - {selectedPatient.age} yrs - {selectedPatient.gender}
              </p>

              <div className="detail-list">
                <div>
                  <Stethoscope size={18} />
                  <span>Condition</span>
                  <strong>{selectedPatient.condition}</strong>
                </div>
                <div>
                  <UserRoundCheck size={18} />
                  <span>Clinician</span>
                  <strong>{selectedPatient.clinician}</strong>
                </div>
                <div>
                  <CalendarClock size={18} />
                  <span>Next action</span>
                  <strong>{selectedPatient.nextAction}</strong>
                </div>
              </div>

              <div className="detail-vitals">
                <div>
                  <span>BP</span>
                  <strong>{selectedPatient.vitals.bp}</strong>
                </div>
                <div>
                  <span>HR</span>
                  <strong>{selectedPatient.vitals.heartRate}</strong>
                </div>
                <div>
                  <span>SpO2</span>
                  <strong>{selectedPatient.vitals.spo2}%</strong>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
