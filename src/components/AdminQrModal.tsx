'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QrCode, X, Copy, Check, Download, Store, Users } from 'lucide-react';

interface AdminQrModalProps {
  clientName: string;
  slug: string;
  token?: string;
}

export default function AdminQrModal({ clientName, slug }: AdminQrModalProps) {
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
  const ownerUrl = `${origin}/register?slug=${slug}`;
  const customerUrl = `${origin}/api/r/${slug}`;

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
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
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

        {/* QR 1: Untuk PEMILIK TOKO — Setup Toko */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-violet-400" />
            <h4 className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">QR Setup Toko</h4>
          </div>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            <strong className="text-neutral-300">Pemilik toko</strong> tap/scan QR ini untuk mengisi data toko (Google Place ID). Setelah itu toko langsung aktif dan pelanggan bisa kasih review.
          </p>

          <div className="flex justify-center p-3 bg-white rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ownerUrl)}`}
              alt={`QR Pemilik ${clientName}`}
              className="w-36 h-36 object-contain block"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">URL Register Pemilik</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
              <input
                type="text"
                readOnly
                value={ownerUrl}
                className="w-full bg-transparent text-[11px] text-neutral-300 font-mono outline-none select-all truncate"
              />
              <button
                type="button"
                onClick={() => handleCopy(ownerUrl, 'owner')}
                className="flex items-center gap-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors border border-violet-500/30 shrink-0 font-medium"
              >
                {copied === 'owner' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied === 'owner' ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(ownerUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            download={`QR-Pemilik-${slug}.png`}
            className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Unduh QR Pemilik (500x500)</span>
          </a>
        </div>

        {/* QR 2: Untuk PELANGGAN — Review Google Maps */}
        <div className="space-y-3 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <h4 className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">QR Pelanggan (Review)</h4>
          </div>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            <strong className="text-neutral-300">Pelanggan</strong> tap/scan QR ini untuk langsung ke halaman review Google Maps. QR ini aktif setelah pemilik selesai setup data toko.
          </p>

          <div className="flex justify-center p-3 bg-white rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(customerUrl)}`}
              alt={`QR Pelanggan ${clientName}`}
              className="w-36 h-36 object-contain block"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">URL Review Google Maps</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
              <input
                type="text"
                readOnly
                value={customerUrl}
                className="w-full bg-transparent text-[11px] text-neutral-300 font-mono outline-none select-all truncate"
              />
              <button
                type="button"
                onClick={() => handleCopy(customerUrl, 'customer')}
                className="flex items-center gap-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors border border-sky-500/30 shrink-0 font-medium"
              >
                {copied === 'customer' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied === 'customer' ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(customerUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            download={`QR-Pelanggan-${slug}.png`}
            className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Unduh QR Pelanggan (500x500)</span>
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
