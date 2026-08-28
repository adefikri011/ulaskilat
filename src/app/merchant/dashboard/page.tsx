import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { BarChart3, Clock, Calendar, TrendingUp, Store, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import NfcQrCard from '@/components/NfcQrCard';

const prisma = new PrismaClient();

export default async function MerchantDashboard() {
  const cookieStore = await cookies();
  const merchantId = cookieStore.get('merchant_auth')?.value;

  if (!merchantId) {
    redirect('/login');
  }

  const client = await prisma.client.findUnique({
    where: { id: merchantId },
    include: { scanLogs: true },
  });

  if (!client) {
    redirect('/login');
  }

  // Statistik
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayCount = client.scanLogs.filter((log) => new Date(log.createdAt) >= startOfDay).length;
  const weekCount = client.scanLogs.filter((log) => new Date(log.createdAt) >= startOfWeek).length;
  const monthCount = client.scanLogs.filter((log) => new Date(log.createdAt) >= startOfMonth).length;

  // Data harian 7 hari
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

  // Jam tersibuk
  const hourlyData = client.scanLogs.reduce((acc: number[], log) => {
    const hour = new Date(log.createdAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, Array(24).fill(0));

  const peakHour = hourlyData.indexOf(Math.max(...hourlyData));
  const peakCount = Math.max(...hourlyData);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800/60">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-white">{client.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/merchant/settings"
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <main className="p-4 max-w-xl mx-auto space-y-4 pb-24">
        {/* Header */}
        <div className="pt-2 pb-1">
          <h1 className="text-xl font-semibold text-white">Dashboard Toko</h1>
          <p className="text-xs text-neutral-400 mt-1">Ringkasan aktivitas scan & tap NFC</p>
        </div>

        {/* Grid Statistik */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">Hari Ini</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-white">{todayCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">7 Hari</span>
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span className="text-2xl font-bold text-white">{weekCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">Bulan Ini</span>
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <span className="text-2xl font-bold text-white">{monthCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">Total</span>
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold text-white">{client.scanCount}</span>
          </div>
        </div>

        {/* Grafik 7 Hari */}
        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <h2 className="text-xs font-medium text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            Tren 7 Hari Terakhir
          </h2>
          <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4 pb-1">
            {dailyCounts.map((item, index) => {
              const heightPercent = Math.max((item.count / maxCount) * 100, 10);
              return (
                <div key={index} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-mono text-neutral-400">{item.count}</span>
                  <div
                    className={`w-full rounded-t-md ${item.isToday ? 'bg-violet-500 shadow-md shadow-violet-500/20' : 'bg-neutral-800'}`}
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
            Jam Tersibuk
          </h2>
          {peakCount > 0 ? (
            <p className="text-sm text-neutral-300">
              Jam <strong className="text-white font-bold">{peakHour}:00</strong> dengan <strong className="text-amber-400">{peakCount} scan</strong>
            </p>
          ) : (
            <p className="text-xs text-neutral-500">Belum ada cukup data.</p>
          )}
        </div>

        {/* NFC / QR Card */}
        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800">
          <NfcQrCard slug={client.slug} />
        </div>

        {/* Template Balasan */}
        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
          <h2 className="text-xs font-medium text-white flex items-center gap-2">
            Template Balasan Ulasan
          </h2>
          <div className="space-y-2 text-xs text-neutral-400">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <p className="font-medium text-neutral-200 mb-1">Bintang 5:</p>
              <p className="italic">&ldquo;Halo Kak! Terima kasih atas ulasan bintang 5 dan kunjungan Anda.&rdquo;</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <p className="font-medium text-neutral-200 mb-1">Netral / Masukan:</p>
              <p className="italic">&ldquo;Halo Kak, terima kasih masukannya. Kami akan terus tingkatkan pelayanan.&rdquo;</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
