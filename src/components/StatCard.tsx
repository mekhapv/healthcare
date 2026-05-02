import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  tone: 'green' | 'amber' | 'red' | 'blue';
  icon: LucideIcon;
};

export function StatCard({ label, value, trend, tone, icon: Icon }: StatCardProps) {
  return (
    <article className={`stat-card ${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{trend}</small>
      </div>
      <Icon size={22} aria-hidden="true" />
    </article>
  );
}
