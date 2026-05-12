'use client';
import { motion } from 'framer-motion';
import { rarityAccentGradient, rarityGlow, rarityRingPulse } from '../data/players';

const RARITY_BADGE = {
  GOAT:      'bg-yellow-400/15 text-yellow-300 border-yellow-400/50',
  Elite:     'bg-purple-400/15 text-purple-200 border-purple-400/50',
  Superstar: 'bg-sky-400/15    text-sky-200    border-sky-400/50',
  Solid:     'bg-slate-400/15  text-slate-200  border-slate-400/40',
  Risk:      'bg-red-500/15    text-red-300    border-red-500/40',
};

export default function BankerModal({ offer, onDeal, onNoDeal, round }) {
  const accent   = rarityAccentGradient(offer.rarity);
  const glow     = rarityGlow(offer.rarity);
  const ringPulse = rarityRingPulse(offer.rarity);
  const badge    = RARITY_BADGE[offer.rarity] ?? RARITY_BADGE.Risk;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 12 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 340, damping: 24, delay: 0.05 }}
        className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#161d30] to-[#0B0F1A] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.75)] overflow-hidden"
      >

        {/* Header */}
        <div className="px-6 pt-5 pb-4 text-center border-b border-white/10 relative">
          <div className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-bold">
            Round {round} · The Banker Is Calling
          </div>
          <h3 className="text-3xl font-black mt-1 tracking-tight">
            <span className="bg-gradient-to-b from-ice to-blue-400 bg-clip-text text-transparent">Banker</span>
            <span className="text-white"> Offer</span>
          </h3>
          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 h-px w-32 bg-gradient-to-r from-transparent via-ice to-transparent" />
        </div>

        {/* Offer card */}
        <div className="px-6 pt-6 pb-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-4 font-semibold">
            In exchange for your case…
          </p>

          <motion.div
            animate={ringPulse ? { boxShadow: [`0 0 0 0 ${glow}`, `0 0 0 14px rgba(0,0,0,0)`, `0 0 0 0 ${glow}`] } : {}}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            className={`mx-auto rounded-2xl bg-gradient-to-br ${accent} p-[2px]`}
          >
            <div
              className="rounded-[14px] bg-[#0B0F1A] px-5 py-6 relative overflow-hidden"
              style={{ boxShadow: `inset 0 0 40px ${glow.replace(')', ', 0.08)').replace('rgba(', 'rgba(')}` }}
            >
              {/* Background glow wash */}
              <div
                className="absolute inset-0 opacity-10 rounded-[14px]"
                style={{ background: `radial-gradient(ellipse at top, ${glow} 0%, transparent 70%)` }}
              />

              <div className="relative">
                <div className="text-2xl md:text-3xl font-black text-white leading-tight">
                  {offer.name}
                </div>
                <div className="text-sm text-gray-400 mt-1 font-medium">{offer.team}</div>
                <div className={`mt-3 inline-block text-[10px] tracking-[0.3em] font-black uppercase px-3 py-1 rounded-full border ${badge}`}>
                  {offer.rarity}
                </div>
              </div>
            </div>
          </motion.div>

          <p className="text-xs text-gray-500 mt-5 leading-relaxed">
            Accept the banker&apos;s player and walk away,
            <br />or keep your case and play on.
          </p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onDeal}
            className="py-3.5 rounded-xl font-black tracking-[0.2em] uppercase text-sm bg-gradient-to-b from-emerald-400 to-emerald-700 text-white shadow-[0_8px_24px_rgba(16,185,129,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            Deal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onNoDeal}
            className="py-3.5 rounded-xl font-black tracking-[0.2em] uppercase text-sm bg-gradient-to-b from-red-500 to-red-800 text-white shadow-[0_8px_24px_rgba(239,68,68,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            No Deal
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
