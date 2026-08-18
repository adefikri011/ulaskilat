import { LucideIcon, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

interface Trend {
  type: 'up' | 'down' | 'flat' | 'new';
  percent?: number;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  sublabel: string;
  accent: 'violet' | 'sky' | 'amber' | 'emerald';
  trend?: Trend | null;
}

const ACCENT = {
  violet: 'bg-violet-500/10 text-violet-400 ring-violet-500/15',
  sky: 'bg-sky-500/10 text-sky-400 ring-sky-500/15',
  amber: 'bg-amber-500/10 text-amber-400 ring-amber-500/15',
  emerald: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/15',
};

function TrendBadge({ trend }: { trend: Trend }) {
  if (trend.type === 'new') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-md">
        <Sparkles className="w-2.5 h-2.5" /> Baru
      </span>
    );
  }
  if (trend.type === 'flat') {
    return <span className="text-[10px] font-medium text-neutral-500">0%</span>;
  }
  const isUp = trend.type === 'up';
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
      {isUp ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
      {trend.percent}%
    </span>
  );
}

export default function StatCard({ icon: Icon, label, value, sublabel, accent, trend }: StatCardProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm min-w-0">
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-neutral-500 truncate pr-2">
          {label}
        </span>
        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ring-1 flex items-center justify-center shrink-0 ${ACCENT[accent]}`}>
          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2]" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums">
          {value}
        </span>
        {trend && <TrendBadge trend={trend} />}
      </div>
      <p className="text-[11px] sm:text-[12px] text-neutral-500 mt-1 truncate">{sublabel}</p>
    </div>
  );
}