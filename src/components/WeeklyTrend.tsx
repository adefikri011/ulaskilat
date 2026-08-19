import { BarChart3, Clock, TrendingUp } from 'lucide-react';

interface DailyData {
  label: string;
  count: number;
  isToday: boolean;
}

interface WeeklyTrendProps {
  data: DailyData[];
  peakHour?: number;
  peakCount?: number;
}

export default function WeeklyTrend({ data, peakHour = 0, peakCount = 0 }: WeeklyTrendProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Kartu Utama: Tren 7 Hari Terakhir */}
      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400 stroke-[1.75]" />
            <h2 className="text-sm font-medium text-white">Tren Interaksi 7 Hari Terakhir</h2>
          </div>
          <span className="text-xs font-mono text-neutral-500 bg-neutral-800/50 px-2.5 py-1 rounded-lg">
            Realtime
          </span>
        </div>

        {/* Visualisasi Grafik Batang */}
        <div className="grid grid-cols-7 gap-2 items-end h-36 pt-6 pb-2 px-1 border-b border-neutral-800/60">
          {data.map((item, index) => {
            const heightPercent = Math.max((item.count / maxCount) * 100, 12);
            return (
              <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </span>
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    item.isToday
                      ? 'bg-gradient-to-t from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/20'
                      : 'bg-neutral-800 hover:bg-neutral-700'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className={`text-[11px] font-medium ${item.isToday ? 'text-violet-400 font-semibold' : 'text-neutral-500'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Keterangan Bawah Grafik */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
          <span>Total interaksi mingguan terekam</span>
          <span className="text-neutral-200 font-medium">
            Puncak tertinggi: <strong className="text-violet-400">{Math.max(...data.map(d => d.count))} scan</strong> dalam sehari
          </span>
        </div>
      </div>
    </div>
  );
}