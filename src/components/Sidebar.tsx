import { BarChart3, QrCode } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-neutral-800/60 bg-[#0d0d0d] p-6 flex flex-col justify-between hidden md:flex">
      <div>
        {/* Logo Brand */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-neutral-800/80 rounded-xl border border-neutral-700/50 text-white">
            <QrCode className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-wide text-white">UlasKilat</span>
            <span className="block text-[10px] text-neutral-500 font-mono">Merchant Portal</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-neutral-800/60 text-white text-sm font-medium border border-neutral-700/40">
            <BarChart3 className="w-4 h-4 text-emerald-400 stroke-[1.75]" />
            Overview Analitik
          </a>
        </nav>
      </div>

      {/* Footer Sidebar */}
      <div className="pt-4 border-t border-neutral-800/60 px-2">
        <p className="text-[11px] text-neutral-500">Secure NFC Merchant System</p>
      </div>
    </aside>
  );
}