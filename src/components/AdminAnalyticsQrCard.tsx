'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, BarChart3, Download } from 'lucide-react';

interface AdminAnalyticsQrCardProps {
  slug: string;
  storeName?: string;
}

export default function AdminAnalyticsQrCard({ slug, storeName }: AdminAnalyticsQrCardProps) {
  const [copied, setCopied] = useState(false);
  
  // URL target untuk mengakses halaman analytics toko/klien
  const analyticsUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/analytics/${slug}` 
    : `/analytics/${slug}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(analyticsUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(analyticsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-medium text-white">
            QR Akses Analytics {storeName ? `— ${storeName}` : ''}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
          Admin Quick Link
        </span>
      </div>

      {/* Konten Utama */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
        {/* QR Code Container */}
        <div className="bg-white p-2 rounded-lg shrink-0 border border-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt={`QR Code Analytics ${slug}`}
            className="w-20 h-20 object-contain block"
          />
        </div>

        {/* Detail Link & Deskripsi */}
        <div className="space-y-2 flex-1 min-w-0 w-full text-center sm:text-left">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Scan QR Code ini untuk membuka halaman monitoring statistik ulasan & tap NFC toko secara langsung tanpa login admin.
          </p>

          {/* Input Link + Action Buttons */}
          <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
            <input
              type="text"
              readOnly
              value={analyticsUrl}
              className="w-full bg-transparent text-[11px] text-neutral-300 font-mono outline-none select-all truncate"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 px-2.5 py-1 rounded text-[11px] transition-colors border border-violet-500/30 shrink-0 font-medium"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Disalin' : 'Salin'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-0.5">
            <a
              href={analyticsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>Buka Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(analyticsUrl)}`}
              target="_blank"
              download={`QR-Analytics-${slug}.png`}
              className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Unduh QR</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}