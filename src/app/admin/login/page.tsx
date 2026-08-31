'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (password === 'admin123123123') {
      document.cookie = 'admin_auth=true; path=/';
      router.push('/admin/dashboard');
    } else {
      alert('Password salah!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
      <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl w-80">
        <h1 className="text-xl font-bold mb-4">Login Admin</h1>
        <input
          type="password"
          className="w-full p-2 mb-4 bg-black border border-neutral-700 rounded text-white"
          placeholder="Masukkan password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={handleLogin}
          className="w-full bg-violet-600 p-2 rounded font-medium"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}