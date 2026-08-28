'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Store, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';

  const [name, setName] = useState('');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama toko wajib diisi!');
      return;
    }

    if (!googlePlaceId.trim()) {
      setError('Google Place ID wajib diisi agar pelanggan bisa review!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/merchant/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, googlePlaceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Gagal menyimpan data toko!');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Terjadi kesalahan, coba lagi.');
      setLoading(false);
    }
  };

  if (!slug) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white px-4">
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-900/50 text-center max-w-sm">
          <Store className="w-6 h-6 text-red-400 mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-white mb-1">Link Tidak Valid</h1>
          <p className="text-sm text-neutral-400">Silakan tap NFC atau scan QR code lagi.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white px-4">
        <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-xl font-bold text-white">Toko Berhasil Didaftarkan!</h1>
          <p className="text-sm text-neutral-400">
            Toko kamu sudah aktif. Pelanggan yang tap/scan QR sekarang akan langsung diarahkan ke Google Maps review.
          </p>
          <button
            onClick={() => router.push(`/analytics/${slug}`)}
            className="w-full bg-violet-600 hover:bg-violet-500 p-3 rounded-xl font-medium text-sm transition-colors"
          >
            Lihat Dashboard Toko
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white px-4">
      <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto">
            <Store className="w-6 h-6 text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Daftarkan Toko</h1>
          <p className="text-xs text-neutral-400">Isi data toko kamu agar pelanggan bisa kasih review di Google Maps</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Slug Toko</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
              <Store className="w-4 h-4 text-violet-400 shrink-0" />
              <span className="text-sm text-neutral-300 font-mono">{slug}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Nama Toko</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <Store className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                placeholder="Contoh: Warung Budi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Google Place ID</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                placeholder="ChIJxxxxxxxxxxxxxxxx"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                className="w-full bg-transparent text-sm text-white font-mono outline-none placeholder:text-neutral-600"
              />
            </div>
            <p className="text-[10px] text-neutral-500 leading-relaxed">
              Dapatkan dari Google Business Profile. Format: <span className="font-mono text-neutral-400">ChIJ...</span>
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 p-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? 'Menyimpan...' : 'Aktifkan Toko'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-sm text-neutral-400">Memuat...</p>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
