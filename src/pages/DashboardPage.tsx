import { AlertTriangle, CalendarCheck, HeartPulse, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotificationButton } from '../components/NotificationButton';
import { StatCard } from '../components/StatCard';
import { useAppStore } from '../store/appStore';

export function DashboardPage() {
  const patients = useAppStore((state) => state.patients);
  const criticalCount = patients.filter((patient) => patient.status === 'Critical').length;
  const dischargeReady = patients.filter((patient) => patient.status === 'Discharge ready').length;

  return (
    <div className="page-stack">
      <section className="stats-grid">
        <StatCard
          label="Active patients"
          value={patients.length.toString()}
          trend="+12% this month"
          tone="blue"
          icon={UsersRound}
        />
        <StatCard
          label="Critical cases"
          value={criticalCount.toString()}
          trend="2 need review"
          tone="red"
          icon={AlertTriangle}
        />
        <StatCard
          label="Avg SpO2"
          value="96.2%"
          trend="Stable cohort"
          tone="green"
          icon={HeartPulse}
        />
        <StatCard
          label="Ready discharge"
          value={dischargeReady.toString()}
          trend="1 summary pending"
          tone="amber"
          icon={CalendarCheck}
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel wide-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Work queue</p>
              <h2>Today's clinical priorities</h2>
            </div>
            <Link to="/patients" className="text-link">
              View patients
            </Link>
          </div>
          <div className="task-list">
            {patients.slice(0, 4).map((patient) => (
              <div className="task-row" key={patient.id}>
                <span className={`risk-dot ${patient.risk.toLowerCase()}`} />
                <div>
                  <strong>{patient.nextAction}</strong>
                  <span>
                    {patient.name} - {patient.condition}
                  </span>
                </div>
                <small>{patient.risk}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Notifications</p>
              <h2>Care alert</h2>
            </div>
          </div>
          <NotificationButton />
        </article>
      </section>
    </div>
  );
}
