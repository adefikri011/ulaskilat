'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QrCode, BarChart3, X, Copy, Check, ExternalLink, Download, Smartphone } from 'lucide-react';

interface AdminQrModalProps {
  clientName: string;
  slug: string;
  token?: string;
}

export default function AdminQrModal({ clientName, slug, token }: AdminQrModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const nfcUrl = `${origin}/api/r/${slug}`;
  const analyticsUrl = `${origin}/analytics/${slug}${token ? `?token=${token}` : ''}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const modal = (
    <div
      className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 min-w-0">
            <QrCode className="w-4 h-4 text-violet-400 shrink-0" />
            <h3 className="text-xs font-semibold text-white truncate">{clientName}</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR 1: URL Print untuk NFC / QR Card */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <h4 className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">QR / NFC untuk Dicetak</h4>
          </div>
          <p className="text-[10px] text-neutral-500">URL ini ditulis ke kartu NFC atau dicetak sebagai QR code. Saat pelanggan tap/scan, mereka akan diarahkan ke Google Maps review.</p>

          <div className="flex justify-center p-3 bg-white rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(nfcUrl)}`}
              alt={`QR NFC ${clientName}`}
              className="w-36 h-36 object-contain block"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">URL untuk ditulis ke NFC / QR</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
              <input
                type="text"
                readOnly
                value={nfcUrl}
                className="w-full bg-transparent text-[11px] text-neutral-300 font-mono outline-none select-all truncate"
              />
              <button
                type="button"
                onClick={() => handleCopy(nfcUrl, 'nfc')}
                className="flex items-center gap-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors border border-sky-500/30 shrink-0 font-medium"
              >
                {copied === 'nfc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied === 'nfc' ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(nfcUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            download={`QR-NFC-${slug}.png`}
            className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Unduh QR untuk Cetak (500x500)</span>
          </a>
        </div>

        {/* QR 2: URL Analytics Dashboard */}
        <div className="space-y-3 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
            <h4 className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">QR Akses Dashboard Analytics</h4>
          </div>
          <p className="text-[10px] text-neutral-500">QR ini untuk merchant mengakses halaman statistik scan toko mereka.</p>

          <div className="flex justify-center p-3 bg-white rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(analyticsUrl)}`}
              alt={`QR Analytics ${clientName}`}
              className="w-24 h-24 object-contain block"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">URL Dashboard Merchant</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
              <input
                type="text"
                readOnly
                value={analyticsUrl}
                className="w-full bg-transparent text-[11px] text-neutral-300 font-mono outline-none select-all truncate"
              />
              <button
                type="button"
                onClick={() => handleCopy(analyticsUrl, 'analytics')}
                className="flex items-center gap-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors border border-violet-500/30 shrink-0 font-medium"
              >
                {copied === 'analytics' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied === 'analytics' ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <a
            href={analyticsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            <span>Buka Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 border border-violet-500/20 transition-all font-medium text-xs shrink-0"
      >
        <QrCode className="w-3.5 h-3.5" />
        <span>Tampilkan QR</span>
      </button>

      {mounted && isOpen && createPortal(modal, document.body)}
    </>
  );
}