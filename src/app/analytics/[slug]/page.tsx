import { PrismaClient } from '@prisma/client';
import { BarChart3, ShieldCheck, Calendar, Clock, TrendingUp, MessageSquare, Store, User } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import NfcQrCard from '@/components/NfcQrCard';

const prisma = new PrismaClient();

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
          <ShieldCheck className="w-6 h-6 text-red-400 mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-white mb-1">Akses Ditolak</h1>
          <p className="text-sm text-neutral-400">Token verifikasi tidak valid.</p>
        </div>
      </div>
    );
  }

  // --- PERHITUNGAN WAKTU & STATISTIK ---
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayCount = client.scanLogs.filter((log) => new Date(log.createdAt) >= startOfDay).length;
  const weekCount = client.scanLogs.filter((log) => new Date(log.createdAt) >= startOfWeek).length;
  const monthCount = client.scanLogs.filter((log) => new Date(log.createdAt) >= startOfMonth).length;
  const totalCount = client.scanCount;

  // --- DATA HARIAN 7 HARI TERAKHIR ---
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

  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);

  // --- JAM TERSIBUK ---
  const hourlyData = client.scanLogs.reduce((acc: number[], log) => {
    const hour = new Date(log.createdAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, Array(24).fill(0));

  const peakHour = hourlyData.indexOf(Math.max(...hourlyData));
  const peakCount = Math.max(...hourlyData);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans pb-32">
      <main className="p-6 max-w-xl mx-auto space-y-6">

        {/* Header Toko */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800/60">
          <div>
            <h1 className="text-xl font-semibold text-white">Dashboard UlasKilat</h1>
            <p className="text-xs text-neutral-400">Analisis performa interaksi toko</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white">
            <Store className="w-3.5 h-3.5 text-neutral-400" />
            {client.name}
          </div>
        </div>

        {/* Grid Kartu Statistik */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">Hari Ini</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-white">{todayCount}</span>
            <p className="text-[10px] text-neutral-500 mt-0.5">Sejak pukul 00:00</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">7 Hari Terakhir</span>
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span className="text-2xl font-bold text-white">{weekCount}</span>
            <p className="text-[10px] text-neutral-500 mt-0.5">Performa mingguan</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">Bulan Ini</span>
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <span className="text-2xl font-bold text-white">{monthCount}</span>
            <p className="text-[10px] text-neutral-500 mt-0.5">Akumulasi bulanan</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">Total Scan</span>
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold text-white">{totalCount}</span>
            <p className="text-[10px] text-neutral-500 mt-0.5">Keseluruhan waktu</p>
          </div>
        </div>

        {/* Grafik Tren Mingguan */}
        <div id="weekly-trend-section" className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              Tren Interaksi 7 Hari Terakhir
            </h2>
          </div>
          <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4 pb-1">
            {dailyCounts.map((item, index) => {
              const heightPercent = Math.max((item.count / maxCount) * 100, 10);
              return (
                <div key={index} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-mono text-neutral-400">{item.count}</span>
                  <div
                    className={`w-full rounded-t-md ${item.isToday ? 'bg-violet-500 shadow-md shadow-violet-500/20' : 'bg-neutral-800'
                      }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className={`text-[10px] ${item.isToday ? 'text-violet-400 font-bold' : 'text-neutral-500'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Jam Tersibuk */}
        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800">
          <h2 className="text-xs font-medium text-white mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Waktu Puncak Interaksi
          </h2>
          {peakCount > 0 ? (
            <p className="text-sm text-neutral-300">
              Jam tersibuk ada di pukul <strong className="text-white font-bold">{peakHour}:00</strong> dengan total <strong className="text-amber-400">{peakCount} scan</strong>.
            </p>
          ) : (
            <p className="text-xs text-neutral-500">Belum ada cukup data.</p>
          )}
        </div>

        {/* Template Balasan Ulasan */}
        <div id="review-templates-section" className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
          <h2 className="text-xs font-medium text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Template Balasan Ulasan Cepat
          </h2>
          <div className="space-y-2 pt-1 text-xs text-neutral-400">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <p className="font-medium text-neutral-200 mb-1">Bintang 5 (Positif):</p>
              <p className="italic">&ldquo;Halo Kak! Terima kasih banyak atas ulasan bintang 5 dan kunjungan Anda ke toko kami.&rdquo;</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <p className="font-medium text-neutral-200 mb-1">Masukan / Netral:</p>
              <p className="italic">&ldquo;Halo Kak, terima kasih atas masukannya. Kami akan terus tingkatkan kualitas pelayanan.&rdquo;</p>
            </div>
          </div>
        </div>

        <div id="store-info-section" className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 pb-2 border-b border-neutral-800">
            <Store className="w-4 h-4 text-violet-400" />
            Informasi Outlet / Toko
          </h2>

          <NfcQrCard slug={client.slug} />
        </div>

        <div id="profile-info-section" className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
          <h2 className="text-xs font-medium text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            Profil Pengelola / Merchant
          </h2>
          <p className="text-xs text-neutral-400">
            Akses dashboard ini dilindungi token privat untuk memastikan hanya pemilik toko yang dapat melihat data analitik pemindaian.
          </p>
        </div>

      </main>

      <BottomNav />

    </div>
  );
}