'use client';
import { motion } from 'framer-motion';
import { rarityAccentGradient, rarityGlow, rarityRingPulse } from '../data/players';

const RARITY_BADGE = {
  GOAT:      'bg-yellow-400/15 text-yellow-300 border-yellow-400/50',
  Elite:     'bg-purple-400/15 text-purple-200 border-purple-400/50',
  Superstar: 'bg-sky-400/15    text-sky-200    border-sky-400/50',
  Stars:     'bg-teal-400/15   text-teal-200   border-teal-400/45',
  Solid:     'bg-slate-400/15  text-slate-200  border-slate-400/40',
  Risk:      'bg-red-500/15    text-red-300    border-red-500/40',
};

function bankerCommentary(stats) {
  const { topTierProb, premiumProb, multiplier } = stats;
  if (topTierProb >= 0.35)
    return { text: "The odds are stacked in your favor. I'm overpaying and we both know it.", color: 'text-emerald-400' };
  if (topTierProb >= 0.20)
    return { text: "Real shot at Elite talent in there. My offer reflects the risk I'm taking.", color: 'text-sky-400' };
  if (topTierProb >= 0.08)
    return { text: "Slim chance at something elite. Could go either way — I'd take the deal.", color: 'text-amber-400' };
  if (premiumProb >= 0.65)
    return { text: "Premium pool remaining. I'm paying up for that uncertainty.", color: 'text-teal-400' };
  if (premiumProb < 0.25)
    return { text: "The good ones are gone. You know it, I know it. Take the offer.", color: 'text-red-400' };
  if (multiplier >= 0.90)
    return { text: "We're deep into the game. This is my fairest offer yet.", color: 'text-gray-300' };
  return { text: "Balanced odds. A reasonable case for staying in — or cashing out.", color: 'text-gray-400' };
}

function ProbChip({ label, prob, color }) {
  const pct = Math.round(prob * 100);
  return (
    <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] gap-0.5 min-w-[80px]">
      <span className={`text-xl font-black tabular-nums leading-none ${color}`}>{pct}%</span>
      <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">{label}</span>
    </div>
  );
}

export default function BankerModal({ offer, stats, onDeal, onNoDeal, round }) {
  const accent    = rarityAccentGradient(offer.rarity);
  const glow      = rarityGlow(offer.rarity);
  const ringPulse = rarityRingPulse(offer.rarity);
  const badge     = RARITY_BADGE[offer.rarity] ?? RARITY_BADGE.Risk;
  const comment   = stats ? bankerCommentary(stats) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 360, damping: 26, delay: 0.04 }}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-gradient-to-b from-[#141928] to-[#0A0D16] border border-white/[0.09] shadow-[0_-20px_80px_rgba(0,0,0,0.7)] sm:shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden"
      >

        {/* Phone call header */}
        <div className="px-6 pt-6 pb-5 text-center border-b border-white/[0.07] relative">
          <div className="text-[10px] uppercase tracking-[0.45em] text-gray-600 font-bold mb-4">
            Round {round} · Banker Is Calling
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.08]" />
            <motion.div
              animate={{ rotate: [0, 18, -18, 18, -18, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }}
              className="text-3xl select-none"
            >
              📞
            </motion.div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.08]" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-red-400"
              />
            ))}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Banker Offer
          </h3>
          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 h-px w-28 bg-gradient-to-r from-transparent via-red-400/60 to-transparent" />
        </div>

        {/* Offer reveal */}
        <div className="px-6 pt-5 pb-3 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-600 font-semibold mb-4">
            In exchange for your case…
          </p>

          {/* Player card */}
          <motion.div
            animate={ringPulse
              ? { boxShadow: [`0 0 0 0 ${glow}`, `0 0 0 12px rgba(0,0,0,0)`, `0 0 0 0 ${glow}`] }
              : {}}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            className={`mx-auto rounded-2xl bg-gradient-to-br ${accent} p-[2px]`}
          >
            <div
              className="rounded-[14px] bg-[#0A0D16] px-5 py-5 relative overflow-hidden"
              style={{ boxShadow: `inset 0 0 40px ${glow.replace(')', ', 0.07)').replace('rgba(', 'rgba(')}` }}
            >
              <div
                className="absolute inset-0 opacity-[0.08] rounded-[14px]"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${glow} 0%, transparent 65%)` }}
              />
              <div className="relative">
                <div className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {offer.name}
                </div>
                <div className="text-sm text-gray-500 mt-1.5 font-medium">{offer.team}</div>
                <div className={`mt-3 inline-block text-[10px] tracking-[0.3em] font-black uppercase px-3 py-1 rounded-full border ${badge}`}>
                  {offer.rarity}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Probability breakdown */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mx-5 mb-3 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="text-[10px] uppercase tracking-[0.35em] text-gray-600 font-bold mb-3 text-center">
              Your Case · {stats.sealedCount} Sealed
            </div>
            <div className="flex gap-2.5 justify-center mb-3">
              <ProbChip label="Elite+" prob={stats.topTierProb}  color="text-purple-300" />
              <ProbChip label="Stars+" prob={stats.premiumProb}  color="text-teal-300"   />
              <ProbChip label="Offer %" prob={stats.multiplier}  color="text-amber-300"  />
            </div>
            {comment && (
              <p className={`text-xs font-medium text-center leading-snug ${comment.color}`}>
                {comment.text}
              </p>
            )}
          </motion.div>
        )}

        {/* Buttons */}
        <div className="px-5 pb-safe-6 grid grid-cols-2 gap-3 mt-1">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            onClick={onDeal}
            className="py-4 rounded-xl font-black tracking-[0.18em] uppercase text-sm bg-gradient-to-b from-emerald-400 to-emerald-700 text-white shadow-[0_8px_24px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            Deal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            onClick={onNoDeal}
            className="py-4 rounded-xl font-black tracking-[0.18em] uppercase text-sm bg-gradient-to-b from-red-500 to-red-800 text-white shadow-[0_8px_24px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            No Deal
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
