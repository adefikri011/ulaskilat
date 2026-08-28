'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, ArrowLeft, Store, Hash, MapPin, Lock } from 'lucide-react';

interface MerchantData {
  id: string;
  name: string;
  slug: string;
  googlePlaceId: string;
}

export default function MerchantSettings() {
  const router = useRouter();
  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/merchant/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.client) {
          setMerchant(data.client);
          setName(data.client.name);
          setSlug(data.client.slug);
          setGooglePlaceId(data.client.googlePlaceId);
        } else {
          router.push('/login');
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const body: Record<string, string> = { name, slug, googlePlaceId };
      if (newPassword.trim()) {
        body.password = newPassword;
      }

      const res = await fetch('/api/merchant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Gagal menyimpan!');
        setSaving(false);
        return;
      }

      setMessage('Berhasil disimpan!');
      setNewPassword('');
      if (data.slug !== merchant?.slug) {
        setMerchant({ ...merchant!, slug: data.slug });
      }
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans">
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800/60">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/merchant/dashboard')}
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
          {/* Nama Toko */}
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

          {/* Slug */}
          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <h2 className="text-xs font-medium text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-sky-400" />
              Slug URL NFC / QR
            </h2>
            <p className="text-[11px] text-neutral-500">Ubah slug akan mengubah URL tap NFC dan QR code toko kamu.</p>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <span className="text-neutral-500 text-sm shrink-0">/api/r/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-_]/g, ''))}
                className="w-full bg-transparent text-sm text-white font-mono outline-none"
              />
            </div>
          </div>

          {/* Google Place ID */}
          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <h2 className="text-xs font-medium text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Google Place ID
            </h2>
            <p className="text-[11px] text-neutral-500">Diperlukan agar scan/tap redirect ke halaman review Google Maps toko kamu.</p>
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

          {/* Ganti Password */}
          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <h2 className="text-xs font-medium text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              Ganti Password
            </h2>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
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
