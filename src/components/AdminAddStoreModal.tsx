'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Store, Hash } from 'lucide-react';

interface AdminAddStoreModalProps {
  onCreated: () => void;
}

export default function AdminAddStoreModal({ onCreated }: AdminAddStoreModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !slug.trim()) {
      setError('Semua field wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Gagal membuat toko!');
        setLoading(false);
        return;
      }

      setName('');
      setSlug('');
      setIsOpen(false);
      onCreated();
    } catch {
      setError('Terjadi kesalahan!');
    }
    setLoading(false);
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
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-semibold text-white">Tambah Toko Baru</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Nama Toko</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <Store className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                placeholder="Contoh: Warung Budi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Slug (URL NFC/QR)</label>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 focus-within:border-violet-500/50 transition-colors">
              <Hash className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                placeholder="warung-budi"
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                className="w-full bg-transparent text-sm text-white font-mono outline-none placeholder:text-neutral-600"
              />
            </div>
            <p className="text-[10px] text-neutral-500">
              URL print: <span className="font-mono text-neutral-400">/api/r/{slug || '{slug}'}</span>
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 p-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? 'Membuat...' : 'Buat Toko'}
            {!loading && <Plus className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Tambah Toko</span>
      </button>

      {mounted && isOpen && createPortal(modal, document.body)}
    </>
  );
}
