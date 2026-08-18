'use client';
import { useState } from 'react';
import { BarChart3, Store, Home, RefreshCw, User } from 'lucide-react';

const items = [
  { icon: Home, label: 'Beranda' },
  { icon: BarChart3, label: 'Statistik' },
];
const itemsRight = [
  { icon: Store, label: 'Toko' },
  { icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const [active, setActive] = useState(0);

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-2 md:hidden z-50">
      <div className="mx-auto max-w-sm bg-[#141416]/90 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] py-2 px-3 flex items-center justify-between shadow-2xl shadow-black/40">
        {items.map(({ icon: Icon }, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`p-2.5 rounded-xl transition-colors ${
              active === i ? 'bg-white/10 text-white' : 'text-neutral-500'
            }`}
          >
            <Icon className="w-5 h-5 stroke-[1.75]" />
          </button>
        ))}

        <button className="mx-1 -mt-8 bg-gradient-to-b from-violet-500 to-violet-600 p-3.5 rounded-full shadow-lg shadow-violet-600/40 text-white border-[3px] border-[#0a0a0a] active:scale-95 transition-transform">
          <RefreshCw className="w-5 h-5 stroke-[2]" />
        </button>

        {itemsRight.map(({ icon: Icon }, i) => {
          const idx = i + 2;
          return (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`p-2.5 rounded-xl transition-colors ${
                active === idx ? 'bg-white/10 text-white' : 'text-neutral-500'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[1.75]" />
            </button>
          );
        })}
      </div>
    </div>
  );
}