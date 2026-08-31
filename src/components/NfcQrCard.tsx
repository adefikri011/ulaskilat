'use client';

import { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, Cpu } from 'lucide-react';

interface NfcQrCardProps {
  slug: string;
}

export default function NfcQrCard({ slug }: NfcQrCardProps) {
  const [copied, setCopied] = useState(false);
  const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/store/${slug}` : `/store/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="nfc-qr-section" className="space-y-4 pt-2">
      {/* Header Kecil */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-medium text-white">QR / NFC untuk Pelanggan</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Ready to Print
        </span>
      </div>

      <p className="text-xs text-neutral-400 leading-relaxed">
        QR / NFC ini untuk <strong className="text-neutral-300">pelanggan</strong>. Saat pelanggan tap/scan, mereka akan melihat halaman toko lalu diarahkan ke Google Maps untuk review.
      </p>

      {/* Kotak URL NFC */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">URL Tap NFC / Scan QR (untuk Pelanggan)</label>
        <div className="flex items-center gap-2 bg-neutral-950/80 p-2.5 rounded-xl border border-neutral-800 focus-within:border-neutral-700 transition-colors">
          <Cpu className="w-4 h-4 text-violet-400 shrink-0" />
          <input
            type="text"
            readOnly
            value={storeUrl}
            className="w-full bg-transparent text-xs text-neutral-300 font-mono outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 px-3 py-1.5 rounded-lg text-xs transition-colors border border-violet-500/30 shrink-0 font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Disalin' : 'Salin'}</span>
          </button>
        </div>
      </div>

      {/* Preview QR Code */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-neutral-950/50 p-3.5 rounded-xl border border-neutral-800/80">
        <div className="bg-white p-2 rounded-lg shrink-0 border border-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(storeUrl)}`}
            alt="QR Code Pelanggan"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain block"
          />
        </div>
        <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
          <h3 className="text-xs font-medium text-white">QR Code untuk Pelanggan</h3>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Scan QR ini menampilkan halaman toko lalu otomatis buka Google Maps untuk review. Pasang di kasir atau meja toko.
          </p>
          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(storeUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-sky-400 hover:text-sky-300 transition-colors pt-0.5"
          >
            <span>Unduh QR untuk Cetak (500x500)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Footer Info Slug */}
      <p className="text-[11px] text-neutral-400 pt-1">
        QR ini terhubung ke toko: <span className="font-semibold text-white">{slug}</span>.
      </p>
    </div>
  );
}