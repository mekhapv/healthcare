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

const chartSummary = [
  { label: 'Active census', value: '68', tone: 'blue' },
  { label: 'Readmits', value: '5', tone: 'red' },
  { label: 'Avg risk load', value: '2.0', tone: 'green' },
];

export function AnalyticsPage() {
  const patients = useAppStore((state) => state.patients);
  const riskData = ['Low', 'Medium', 'High'].map((risk) => ({
    risk,
    count: patients.filter((patient) => patient.risk === risk).length,
  }));

  return (
    <div className="page-stack analytics-stack">
      <section className="panel analytics-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Analytics</p>
            <h2>Census and readmission trend</h2>
          </div>
          <div className="analytics-metrics" aria-label="Analytics summary">
            {chartSummary.map((item) => (
              <div className={`metric-pill ${item.tone}`} key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-area animated-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={admissions} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde6e4" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ stroke: '#9fb2ad', strokeDasharray: '4 4' }}
                contentStyle={{
                  border: '1px solid #dbe5e2',
                  borderRadius: 8,
                  boxShadow: '0 14px 35px rgba(23, 33, 31, 0.14)',
                }}
              />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                activeDot={{ r: 7, stroke: '#bfdbfe', strokeWidth: 5 }}
                isAnimationActive
                animationBegin={250}
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="readmit"
                stroke="#dc2626"
                strokeWidth={4}
                dot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }}
                activeDot={{ r: 7, stroke: '#fecaca', strokeWidth: 5 }}
                isAnimationActive
                animationBegin={650}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel analytics-panel analytics-panel-delayed">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Population health</p>
            <h2>Risk distribution</h2>
          </div>
        </div>
        <div className="chart-area compact animated-chart">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde6e4" />
              <XAxis dataKey="risk" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(15, 118, 110, 0.08)' }}
                contentStyle={{
                  border: '1px solid #dbe5e2',
                  borderRadius: 8,
                  boxShadow: '0 14px 35px rgba(23, 33, 31, 0.14)',
                }}
              />
              <Bar
                dataKey="count"
                fill="#0f766e"
                radius={[6, 6, 0, 0]}
                isAnimationActive
                animationBegin={500}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
