'use client';

import { useState } from 'react';
import { MessageSquareText, Copy, Check } from 'lucide-react';

const templates = [
  {
    title: 'Ulasan Positif (Bintang 5)',
    text: 'Halo Kak! Terima kasih banyak atas ulasan bintang 5 dan kunjungan Anda ke toko kami. Senang bisa melayani Anda, ditunggu kedatangannya kembali ya!',
  },
  {
    title: 'Ulasan Positif (Kasual / Santai)',
    text: 'Makasih banyak ya Kak atas support-nya! Ditunggu next order/kunjungannya lagi di toko kami! 🙏',
  },
  {
    title: 'Ulasan Netral / Masukan',
    text: 'Halo Kak, terima kasih atas masukannya. Kami akan terus meningkatkan kualitas pelayanan kami agar kedepannya menjadi jauh lebih baik lagi.',
  },
];

export default function ReviewTemplates() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquareText className="w-4 h-4 text-emerald-400 stroke-[1.75]" />
        <h2 className="text-sm font-medium text-white">Template Balasan Ulasan Google</h2>
      </div>
      <p className="text-xs text-neutral-400">
        Gunakan salinan teks cepat di bawah ini untuk membalas ulasan pelanggan di Google Maps secara profesional.
      </p>

      <div className="space-y-3 pt-2">
        {templates.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-300">{item.title}</span>
              <button
                onClick={() => handleCopy(item.text, idx)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-400 italic bg-neutral-950/50 p-2.5 rounded-lg border border-neutral-850">
              &ldquo;{item.text}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}