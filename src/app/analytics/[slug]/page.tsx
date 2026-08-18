import { PrismaClient } from '@prisma/client';
import { BarChart3, ShieldCheck, Calendar, Clock, TrendingUp } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import StatCard from '@/components/StatCard';
import WeeklyTrend from '@/components/WeeklyTrend';

const prisma = new PrismaClient();

function getTrend(current: number, prev: number) {
  if (prev === 0) return current > 0 ? { type: 'new' as const } : null;
  const percent = Math.round(((current - prev) / prev) * 100);
  if (percent === 0) return { type: 'flat' as const, percent: 0 };
  return { type: (percent > 0 ? 'up' : 'down') as 'up' | 'down', percent: Math.abs(percent) };
}

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchQuery = await searchParams;

  const client = await prisma.client.findUnique({
    where: { slug: resolvedParams.slug },
    include: { scanLogs: true },
  });

  if (!client || client.secretToken !== resolvedSearchQuery.token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white px-4">
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-900/50 text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-red-400 stroke-[1.5]" />
          </div>
          <h1 className="text-lg font-semibold text-white mb-1">Akses Ditolak</h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Halaman ini bersifat privat dan memerlukan token verifikasi yang sah.
          </p>
        </div>
      </div>
    );
  }

  // --- PERIODE SAAT INI ---
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayCount = client.scanLogs.filter((log) => new Date(log.createdAt) >= startOfDay).length;
  const weekCount = client.scanLogs.filter((log) => new Date(log.createdAt) >= startOfWeek).length;
  const monthCount = client.scanLogs.filter((log) => new Date(log.createdAt) >= startOfMonth).length;
  const totalCount = client.scanCount;

  // --- PERIODE SEBELUMNYA (buat trend %) ---
  const startOfYesterday = new Date(startOfDay);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfPrevWeek = new Date();
  startOfPrevWeek.setDate(now.getDate() - 14);

  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const yesterdayCount = client.scanLogs.filter((log) => {
    const d = new Date(log.createdAt);
    return d >= startOfYesterday && d < startOfDay;
  }).length;

  const prevWeekCount = client.scanLogs.filter((log) => {
    const d = new Date(log.createdAt);
    return d >= startOfPrevWeek && d < startOfWeek;
  }).length;

  const prevMonthCount = client.scanLogs.filter((log) => {
    const d = new Date(log.createdAt);
    return d >= startOfPrevMonth && d < startOfMonth;
  }).length;

  // --- DATA HARIAN 7 HARI TERAKHIR (buat chart) ---
  const dailyCounts = Array.from({ length: 7 }).map((_, i) => {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const count = client.scanLogs.filter((log) => {
      const d = new Date(log.createdAt);
      return d >= dayStart && d < dayEnd;
    }).length;
    return {
      label: dayStart.toLocaleDateString('id-ID', { weekday: 'short' }),
      count,
      isToday: i === 6,
    };
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 flex font-sans selection:bg-neutral-800">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="pb-6 border-b border-neutral-800/60">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-emerald-400/90">
                    Live
                  </span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard Performa</h1>
                <p className="text-sm text-neutral-500 mt-1.5 max-w-md">
                  Analisis interaksi pelanggan berdasarkan periode waktu.
                </p>
              </div>

              <div className="flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 w-fit">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-[13px] font-semibold text-neutral-300 shrink-0">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">{client.name}</p>
                  <p className="text-[11px] text-neutral-500 font-mono">kartu terhubung</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Kartu Periode Analitik */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={Clock}
              label="Hari Ini"
              value={todayCount}
              sublabel="Scan sejak pukul 00:00"
              accent="amber"
              trend={getTrend(todayCount, yesterdayCount)}
            />
            <StatCard
              icon={Calendar}
              label="7 Hari Terakhir"
              value={weekCount}
              sublabel="Performa mingguan"
              accent="violet"
              trend={getTrend(weekCount, prevWeekCount)}
            />
            <StatCard
              icon={TrendingUp}
              label="Bulan Ini"
              value={monthCount}
              sublabel="Akumulasi bulan berjalan"
              accent="sky"
              trend={getTrend(monthCount, prevMonthCount)}
            />
            <StatCard
              icon={BarChart3}
              label="Total Keseluruhan"
              value={totalCount}
              sublabel="Seluruh waktu aktif"
              accent="emerald"
            />
          </div>

          {/* Tren Mingguan */}
          <WeeklyTrend data={dailyCounts} />

          {/* Info Box */}
          <div className="p-5 rounded-2xl bg-neutral-900/20 border border-neutral-800/60 text-sm text-neutral-400 space-y-1.5">
            <h2 className="font-medium text-neutral-200">Tentang Statistik Ini</h2>
            <p className="leading-relaxed">
              Data di atas diperbarui secara otomatis setiap kali ada perangkat yang memindai atau
              men-tap kartu NFC UlasKilat milik toko Anda.
            </p>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
}