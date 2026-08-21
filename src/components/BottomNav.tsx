'use client';

import { Home, MessageSquare, RefreshCw, Store, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [active, setActive] = useState<'home' | 'templates' | 'store' | 'profile'>('home');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (pathname && pathname.startsWith('/admin')) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      const templatesEl = document.getElementById('review-templates-section');
      const storeEl = document.getElementById('store-info-section');
      const profileEl = document.getElementById('profile-info-section');

      if (profileEl && scrollPos >= profileEl.offsetTop) {
        setActive('profile');
      } else if (storeEl && scrollPos >= storeEl.offsetTop) {
        setActive('store');
      } else if (templatesEl && scrollPos >= templatesEl.offsetTop) {
        setActive('templates');
      } else {
        setActive('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Jika sedang di halaman admin, jangan render apa pun
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-2 z-50">
      <div className="mx-auto max-w-sm bg-[#141416]/95 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] py-2 px-3 flex items-center justify-between shadow-2xl">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`p-3 rounded-xl transition-colors ${active === 'home' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          title="Beranda"
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
        </button>

        <button
          onClick={() => document.getElementById('review-templates-section')?.scrollIntoView({ behavior: 'smooth' })}
          className={`p-3 rounded-xl transition-colors ${active === 'templates' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          title="Template Ulasan"
        >
          <MessageSquare className="w-5 h-5 stroke-[1.75]" />
        </button>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mx-1 -mt-8 bg-gradient-to-b from-violet-500 to-violet-600 p-3.5 rounded-full shadow-lg shadow-violet-600/40 text-white border-[3px] border-[#0a0a0a] active:scale-95 transition-transform disabled:opacity-60"
          title="Muat ulang data"
        >
          <RefreshCw className={`w-5 h-5 stroke-[2] ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => document.getElementById('store-info-section')?.scrollIntoView({ behavior: 'smooth' })}
          className={`p-3 rounded-xl transition-colors ${active === 'store' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          title="Informasi Toko"
        >
          <Store className="w-5 h-5 stroke-[1.75]" />
        </button>

        <button
          onClick={() => document.getElementById('profile-info-section')?.scrollIntoView({ behavior: 'smooth' })}
          className={`p-3 rounded-xl transition-colors ${active === 'profile' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          title="Profil Merchant"
        >
          <User className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>
    </div>
  );
}