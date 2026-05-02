import { Grid2X2, List } from 'lucide-react';
import type { ViewMode } from '../types';

type ViewToggleProps = {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
};

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" aria-label="Patient view mode">
      <button
        type="button"
        className={value === 'grid' ? 'active' : ''}
        onClick={() => onChange('grid')}
        title="Grid view"
        aria-label="Grid view"
      >
        <Grid2X2 size={17} />
      </button>
      <button
        type="button"
        className={value === 'list' ? 'active' : ''}
        onClick={() => onChange('list')}
        title="List view"
        aria-label="List view"
      >
        <List size={17} />
      </button>
    </div>
  );
}
