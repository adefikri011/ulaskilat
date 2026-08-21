'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, ShieldAlert } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; max-age=0';
    window.location.href = '/admin/login';
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between p-6 z-40">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">UlasKilat Admin</h2>
            <p className="text-[11px] text-neutral-500">Panel Kontrol Utama</p>
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              pathname === '/admin/dashboard'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 stroke-[1.75]" />
            Dashboard Klien
          </Link>
        </nav>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4 stroke-[1.75]" />
          Keluar (Logout)
        </button>
      </div>
    </aside>
  );
}