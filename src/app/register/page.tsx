'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Store, Lock, User, Phone, ArrowRight } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim() || !password.trim()) {
      setError('Semua field wajib diisi!');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Gagal mendaftar!');
        setLoading(false);
        return;
      }

      router.push('/login?registered=1');
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
          <h1 className="text-lg font-semibold text-white mb-1">Slug Tidak Valid</h1>
          <p className="text-sm text-neutral-400">Silakan tap NFC atau scan QR code lagi.</p>
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
          <h1 className="text-xl font-bold text-white">Daftar Merchant</h1>
          <p className="text-xs text-neutral-400">Lengkapi data toko kamu untuk mulai menggunakan UlasKilat</p>
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
              <User className="w-4 h-4 text-neutral-500 shrink-0" />
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
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">No. HP / WhatsApp</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Password</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <Lock className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 p-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500">
          Sudah punya akun?{' '}
          <a href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Masuk</a>
        </p>
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
