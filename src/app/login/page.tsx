'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Phone, Lock } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim() || !password.trim()) {
      setError('Semua field wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login gagal!');
        setLoading(false);
        return;
      }

      router.push('/merchant/dashboard');
    } catch {
      setError('Terjadi kesalahan, coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white px-4">
      <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6 text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Masuk Merchant</h1>
          <p className="text-xs text-neutral-400">Akses dashboard analitik toko kamu</p>
        </div>

        {registered && (
          <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-center">
            Registrasi berhasil! Silakan masuk.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Masukkan password"
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
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 p-3 rounded-xl font-medium text-sm transition-colors"
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500">
          Belum punya akun?{' '}
          <a href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">Daftar</a>
        </p>
      </div>
    </div>
  );
}

export default function MerchantLogin() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-sm text-neutral-400">Memuat...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
