'use client';
import { tierColor, tierLabel, tierAccentGradient } from '../data/players';

export default function BankerModal({ offer, onDeal, onNoDeal, round }) {
  const tier = tierColor(offer.score);
  const accent = tierAccentGradient(tier);
  const ringPulse = tier === 'jackpot' || tier === 'elite';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-overlay-in">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#141a2c] to-[#0B0F1A] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden animate-modal-in">

        <div className="px-6 pt-5 pb-4 text-center border-b border-white/10 relative">
          <div className="text-[10px] tracking-[0.35em] uppercase text-gray-500 font-bold">
            Round {round} · Incoming Call
          </div>
          <h3 className="text-3xl font-black mt-1 tracking-tight">
            <span className="bg-gradient-to-b from-ice to-blue-500 bg-clip-text text-transparent">Banker</span>
            <span className="text-white"> Offer</span>
          </h3>
          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 h-px w-32 bg-gradient-to-r from-transparent via-ice to-transparent" />
        </div>

        <div className="px-6 pt-6 pb-4 text-center">
          <div className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-3 font-semibold">
            In place of your case…
          </div>

          <div
            className={`mx-auto rounded-2xl bg-gradient-to-br ${accent} p-[2px] ${ringPulse ? 'animate-ring-pulse' : ''}`}
          >
            <div className="rounded-[14px] bg-[#0B0F1A] px-5 py-6">
              <div className="text-2xl md:text-3xl font-black text-white leading-tight">
                {offer.name}
              </div>
              <div className="text-sm text-gray-400 mt-1 font-medium">{offer.team}</div>
              <div className="mt-3 inline-block text-[10px] tracking-[0.3em] font-black uppercase px-3 py-1 rounded-full border border-white/15 text-gray-300">
                {tierLabel(offer.score)}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-5 leading-relaxed">
            Take the banker&apos;s player and end the game,
            <br />or keep your case and play on.
          </p>
        </div>

        <div className="px-6 pb-6 grid grid-cols-2 gap-3">
          <button
            onClick={onDeal}
            className="py-3.5 rounded-xl font-black tracking-[0.2em] uppercase text-sm bg-gradient-to-b from-emerald-400 to-emerald-700 text-white shadow-[0_8px_24px_rgba(16,185,129,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:scale-[1.03] active:scale-95 transition-transform"
          >
            Deal
          </button>
          <button
            onClick={onNoDeal}
            className="py-3.5 rounded-xl font-black tracking-[0.2em] uppercase text-sm bg-gradient-to-b from-red-500 to-red-800 text-white shadow-[0_8px_24px_rgba(239,68,68,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:scale-[1.03] active:scale-95 transition-transform"
          >
            No Deal
          </button>
        </div>
      </div>
    </div>
  );
}
