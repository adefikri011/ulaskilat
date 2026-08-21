'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QrCode, BarChart3, X, Copy, Check, ExternalLink, Download } from 'lucide-react';

interface AdminQrModalProps {
  clientName: string;
  slug: string;
  token?: string;
}

export default function AdminQrModal({ clientName, slug, token }: AdminQrModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const queryToken = token ? `?token=${token}` : '';
  const activeAnalyticsUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/analytics/${slug}${queryToken}`
      : `/analytics/${slug}${queryToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeAnalyticsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modal = (
    <div
      className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 min-w-0">
            <BarChart3 className="w-4 h-4 text-violet-400 shrink-0" />
            <h3 className="text-xs font-semibold text-white truncate">
              QR Analytics — {clientName}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-center p-4 bg-neutral-950 rounded-xl border border-neutral-800">
          <div className="bg-white p-2.5 rounded-xl shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activeAnalyticsUrl)}`}
              alt={`QR Code ${clientName}`}
              className="w-40 h-40 object-contain block"
            />
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">
              URL Akses Dashboard
            </label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
              <input
                type="text"
                readOnly
                value={activeAnalyticsUrl}
                className="w-full bg-transparent text-xs text-neutral-300 font-mono outline-none select-all truncate"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 px-3 py-1.5 rounded-lg text-xs transition-colors border border-violet-500/30 shrink-0 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href={activeAnalyticsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium"
            >
              <span>Buka Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(activeAnalyticsUrl)}`}
              target="_blank"
              download={`QR-Analytics-${slug}.png`}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PNG</span>
            </a>
          </div>
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