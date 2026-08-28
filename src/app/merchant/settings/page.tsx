'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Settings, Save, ArrowLeft, Store, MapPin } from 'lucide-react';

interface MerchantData {
  id: string;
  name: string;
  slug: string;
  googlePlaceId: string;
}

function SettingsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';

  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const [name, setName] = useState('');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    fetch(`/api/merchant/settings?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.client) {
          setMerchant(data.client);
          setName(data.client.name);
          setGooglePlaceId(data.client.googlePlaceId);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/merchant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, googlePlaceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Gagal menyimpan!');
        setSaving(false);
        return;
      }

      setMessage('Berhasil disimpan!');
    } catch {
      setError('Terjadi kesalahan!');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-sm text-neutral-400">Memuat...</p>
      </div>
    );
  }

  if (!slug || !merchant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white px-4">
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-900/50 text-center max-w-sm">
          <Store className="w-6 h-6 text-red-400 mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-white mb-1">Toko Tidak Ditemukan</h1>
          <p className="text-sm text-neutral-400">Pastikan URL pengaturan sudah benar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans">
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800/60">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Settings className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-white">Pengaturan Toko</span>
        </div>
      </div>

      <main className="p-4 max-w-xl mx-auto space-y-4 pb-24 pt-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <h2 className="text-xs font-medium text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-violet-400" />
              Nama Toko
            </h2>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <h2 className="text-xs font-medium text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Google Place ID
            </h2>
            <p className="text-[11px] text-neutral-500">Ubah Google Place ID jika toko kamu pindah atau data salah.</p>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <input
                type="text"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                placeholder="ChIJxxxxxxxxxxxxxxxx"
                className="w-full bg-transparent text-sm text-white font-mono outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>

          {message && (
            <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">{message}</p>
          )}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{error}</p>
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

export default function MerchantSettings() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-sm text-neutral-400">Memuat...</p>
      </div>
    }>
      <SettingsForm />
    </Suspense>
  );
}
