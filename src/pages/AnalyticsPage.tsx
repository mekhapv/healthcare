import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppStore } from '../store/appStore';

const admissions = [
  { month: 'Jan', patients: 42, readmit: 8 },
  { month: 'Feb', patients: 49, readmit: 7 },
  { month: 'Mar', patients: 55, readmit: 9 },
  { month: 'Apr', patients: 61, readmit: 6 },
  { month: 'May', patients: 68, readmit: 5 },
];

export function AnalyticsPage() {
  const patients = useAppStore((state) => state.patients);
  const riskData = ['Low', 'Medium', 'High'].map((risk) => ({
    risk,
    count: patients.filter((patient) => patient.risk === risk).length,
  }));

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Analytics</p>
            <h2>Census and readmission trend</h2>
          </div>
        </div>
        <div className="chart-area">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={admissions} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde6e4" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="readmit" stroke="#dc2626" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Population health</p>
            <h2>Risk distribution</h2>
          </div>
        </div>
        <div className="chart-area compact">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde6e4" />
              <XAxis dataKey="risk" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
