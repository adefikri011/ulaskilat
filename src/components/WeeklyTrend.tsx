interface DayData {
  label: string;
  count: number;
  isToday?: boolean;
}

export default function WeeklyTrend({ data }: { data: DayData[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const hasActivity = data.some((d) => d.count > 0);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-medium text-neutral-200">Tren 7 Hari Terakhir</h2>
        <span className="text-[11px] text-neutral-500 font-mono">{total} tap</span>
      </div>

      {hasActivity ? (
        <div className="flex items-end justify-between gap-2 h-24">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-16">
                {d.count > 0 && (
                  <span className="text-[10px] text-neutral-500 mb-1 tabular-nums">{d.count}</span>
                )}
                <div
                  className={`w-full rounded-md transition-all ${d.isToday ? 'bg-violet-500' : 'bg-neutral-800'}`}
                  style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 12 : 4)}%` }}
                />
              </div>
              <span className={`text-[10px] uppercase tracking-wide ${d.isToday ? 'text-violet-400 font-medium' : 'text-neutral-600'}`}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center px-4">
          <p className="text-[13px] text-neutral-600 text-center leading-relaxed">
            Belum ada aktivitas minggu ini. Pastikan kartu NFC diletakkan di area yang mudah dijangkau pelanggan.
          </p>
        </div>
      )}
    </div>
  );
}