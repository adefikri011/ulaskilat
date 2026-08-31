'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BarChart3, Clock, Store, MapPin, Save, Loader2 } from 'lucide-react';
import NfcQrCard from '@/components/NfcQrCard';

interface ClientData {
  id: string;
  name: string;
  slug: string;
  googlePlaceId: string;
  scanCount: number;
  status: string;
  createdAt: string;
}

interface DailyCount {
  label: string;
  count: number;
  isToday: boolean;
}

interface HourlyData {
  peakHour: number;
  peakCount: number;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';

  const [client, setClient] = useState<ClientData | null>(null);
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData>({ peakHour: 0, peakCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Settings form
  const [name, setName] = useState('');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    fetch(`/api/merchant/dashboard?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.client) {
          setClient(data.client);
          setName(data.client.name);
          setGooglePlaceId(data.client.googlePlaceId);
          setDailyCounts(data.dailyCounts || []);
          setHourlyData(data.hourlyData || { peakHour: 0, peakCount: 0 });
        } else {
          setError(data.message || 'Toko tidak ditemukan');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal memuat data toko');
        setLoading(false);
      });
  }, [slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    setSaveError('');

    try {
      const res = await fetch('/api/merchant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, googlePlaceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveError(data.message || 'Gagal menyimpan!');
        setSaving(false);
        return;
      }

      setSaveMessage('Berhasil disimpan!');
      setClient((prev) => prev ? { ...prev, name, googlePlaceId } : null);
    } catch {
      setSaveError('Terjadi kesalahan!');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white px-4">
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-900/50 text-center max-w-sm">
          <Store className="w-6 h-6 text-red-400 mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-white mb-1">Toko Tidak Ditemukan</h1>
          <p className="text-sm text-neutral-400">{error || 'Pastikan link sudah benar.'}</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800/60">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-2">
          <Store className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-white">{client.name}</span>
        </div>
      </div>

      <main className="p-4 max-w-xl mx-auto space-y-4 pt-4">
        {/* Header */}
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-white">Dashboard Toko</h1>
          <p className="text-xs text-neutral-400 mt-1">Statistik scan & pengaturan toko</p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">Total Scan</span>
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold text-white">{client.scanCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400 uppercase">Jam Tersibuk</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-white">
              {hourlyData.peakCount > 0 ? `${hourlyData.peakHour}:00` : '-'}
            </span>
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

        {/* QR Pelanggan */}
        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800">
          <NfcQrCard slug={client.slug} />
        </div>

        {/* Pengaturan Toko */}
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <h2 className="text-xs font-medium text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-violet-400" />
            Pengaturan Toko
          </h2>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Nama Toko</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <Store className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Google Place ID</label>
            <p className="text-[10px] text-neutral-500">Ubah jika pindah lokasi atau data salah.</p>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                placeholder="ChIJxxxxxxxxxxxxxxxx"
                className="w-full bg-transparent text-sm text-white font-mono outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>

          {saveMessage && (
            <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">{saveMessage}</p>
          )}
          {saveError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{saveError}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 p-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            {!saving && <Save className="w-4 h-4" />}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function MerchantDashboard() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
