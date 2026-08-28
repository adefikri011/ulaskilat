'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminQrModal from '@/components/AdminQrModal';
import AdminAddStoreModal from '@/components/AdminAddStoreModal';
import { Users, Scan, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';

interface ClientData {
  id: string;
  name: string;
  slug: string;
  secretToken: string;
  scanCount: number;
  status: string;
  createdAt: string;
}

interface DailyCount {
  label: string;
  count: number;
  isToday: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      if (data.clients) {
        setClients(data.clients);
        setDailyCounts(data.dailyCounts || []);
      } else {
        router.push('/admin/login');
      }
    } catch {
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalScans = clients.reduce((acc, c) => acc + c.scanCount, 0);
  const maxGlobalCount = Math.max(...dailyCounts.map((d) => d.count), 1);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-neutral-200 font-sans">
      <AdminSidebar />

      <main className="flex-1 min-w-0 ml-64 p-6 md:p-10 pb-20">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Ringkasan Sistem</h1>
              <p className="text-xs text-neutral-400 mt-1">
                Monitoring aktivitas seluruh jaringan UlasKilat (Scan &amp; Tap NFC).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchData()}
                className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Muat ulang"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <AdminAddStoreModal onCreated={fetchData} />
            </div>
          </div>

          {/* Kartu Statistik Global */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-4 h-4 text-violet-400" />
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  Total Klien / Toko
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{clients.length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <Scan className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  Total Seluruh Scan / Tap
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{totalScans}</p>
            </div>
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  Rata-rata Scan/Toko
                </span>
              </div>
              <p className="text-3xl font-bold text-white">
                {clients.length > 0 ? (totalScans / clients.length).toFixed(1) : 0}
              </p>
            </div>
          </div>

          {/* Grafik Global */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                Grafik Aktivitas Global — 7 Hari Terakhir
              </h2>
              <span className="text-[10px] font-mono text-neutral-500 bg-neutral-800/50 px-2 py-1 rounded-md">
                Realtime Data
              </span>
            </div>
            <div className="grid grid-cols-7 gap-3 items-end h-32 pt-6 pb-1 px-2 border-b border-neutral-800/60">
              {dailyCounts.map((item, index) => {
                const heightPercent = Math.max((item.count / maxGlobalCount) * 100, 12);
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
                    <span className={`text-[11px] ${item.isToday ? 'text-violet-400 font-bold' : 'text-neutral-500'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span>Akumulasi seluruh interaksi tap NFC &amp; scan QR code</span>
              <span className="text-neutral-300 font-medium">
                Puncak tertinggi:{' '}
                <strong className="text-violet-400">
                  {Math.max(...dailyCounts.map((d) => d.count))} interaksi
                </strong>{' '}
                dalam sehari
              </span>
            </div>
          </div>

          {/* Tabel Detail Toko */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
            <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-sm font-medium text-white">Daftar Toko</h2>
              <span className="text-[11px] text-neutral-500">{clients.length} toko terdaftar</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800 bg-black/20">
                    <th className="p-4">Toko</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">QR Print / NFC</th>
                    <th className="p-4 text-right">Total Scan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-xs">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-neutral-500">
                        Belum ada toko. Klik &quot;Tambah Toko&quot; untuk membuat baru.
                      </td>
                    </tr>
                  ) : (
                    clients.map((c) => (
                      <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-medium text-white">{c.name}</td>
                        <td className="p-4 font-mono text-neutral-400">/{c.slug}</td>
                        <td className="p-4">
                          {c.status === 'active' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
                              <span className="w-1 h-1 rounded-full bg-emerald-400" /> Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px]">
                              <span className="w-1 h-1 rounded-full bg-amber-400" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <AdminQrModal clientName={c.name} slug={c.slug} token={c.secretToken} />
                        </td>
                        <td className="p-4 text-right font-mono font-medium text-white">{c.scanCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
