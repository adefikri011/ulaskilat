'use client';

import { useState, useEffect } from 'react';
import { Star, MapPin, ExternalLink, Loader2 } from 'lucide-react';

interface StoreData {
  name: string;
  slug: string;
  googlePlaceId: string;
}

export default function StorePage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<StoreData | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/store/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.store) {
          setStore(data.store);
        } else {
          setError(data.message || 'Toko tidak ditemukan');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal memuat data toko');
        setLoading(false);
      });
  }, [params.slug]);

  useEffect(() => {
    if (!store || !store.googlePlaceId || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [store, countdown]);

  useEffect(() => {
    if (store && store.googlePlaceId && countdown === 0) {
      redirectToMaps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, store]);

  const redirectToMaps = () => {
    if (!store?.googlePlaceId) return;
    // Gunakan URL universal yang bisa buka Google Maps app di HP
    const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${store.googlePlaceId}&review=1`;
    window.location.href = mapsUrl;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#111] px-4">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-lg font-semibold text-white">Toko Tidak Ditemukan</h1>
          <p className="text-sm text-neutral-400">{error || 'Pastikan link yang kamu buka sudah benar.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#111] px-4">
      <div className="w-full max-w-sm">
        {/* Card Utama */}
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-3xl p-8 space-y-6 text-center backdrop-blur-xl shadow-2xl">

          {/* Icon Toko */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20">
            <Star className="w-10 h-10 text-white" fill="currentColor" />
          </div>

          {/* Info Toko */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">{store.name}</h1>
            <p className="text-sm text-neutral-400">Bantu kami dengan memberikan ulasan di Google Maps</p>
          </div>

          {/* Bintang Rating Preview */}
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-7 h-7 text-amber-400"
                fill="currentColor"
              />
            ))}
          </div>

          {/* Countdown / Tombol */}
          <div className="space-y-3">
            {countdown > 0 ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-violet-400 font-mono">{countdown}</span>
                  </div>
                  <span className="text-xs text-neutral-500">detik menuju Google Maps</span>
                </div>

                <button
                  onClick={redirectToMaps}
                  className="w-full bg-violet-600 hover:bg-violet-500 py-3.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-violet-600/20"
                >
                  <MapPin className="w-4 h-4" />
                  Buka Sekarang
                </button>
              </>
            ) : (
              <button
                onClick={redirectToMaps}
                className="w-full bg-violet-600 hover:bg-violet-500 py-3.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-violet-600/20"
              >
                <ExternalLink className="w-4 h-4" />
                Buka Google Maps
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-neutral-600 mt-6">
          Powered by <span className="text-neutral-400 font-medium">UlasKilat</span>
        </p>
      </div>
    </div>
  );
}
