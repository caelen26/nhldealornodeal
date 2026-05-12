'use client';
import { motion } from 'framer-motion';
import { rarityAccentGradient, rarityGlow } from '../data/players';

const RARITY_BADGE = {
  GOAT:      'bg-yellow-400/15 text-yellow-300 border-yellow-400/50',
  Elite:     'bg-purple-400/15 text-purple-200 border-purple-400/50',
  Superstar: 'bg-sky-400/15    text-sky-200    border-sky-400/50',
  Solid:     'bg-slate-400/15  text-slate-200  border-slate-400/40',
  Risk:      'bg-red-500/15    text-red-300    border-red-500/40',
};

const OUTCOME_CONFIG = {
  deal: {
    eyebrow: "You took the deal",
    headline: "It's a Deal!",
    sub: "You accepted the banker's offer.",
    mainLabel: 'Your Player',
    otherLabel: 'Your case held',
    verdict: (beat, equal) =>
      beat  ? 'The banker beat you — your case was worth more.'
            : equal ? 'A perfect tie. Either way the same result.'
            : 'Smart deal. The banker paid more than your case was worth.',
  },
  keep: {
    eyebrow: "You kept your case",
    headline: "Held Your Ground!",
    sub: "You trusted the pick and stayed put.",
    mainLabel: 'Your Player',
    otherLabel: 'The other case held',
    verdict: (beat, equal) =>
      beat  ? 'The swap would have been better. Hindsight is 20/20.'
            : equal ? 'Both cases were equal — solid call.'
            : 'Your case was the better one. Well played.',
  },
  swap: {
    eyebrow: "You swapped cases",
    headline: "Took the Switch!",
    sub: "Bold. You switched cases at the very last second.",
    mainLabel: 'Your Player',
    otherLabel: 'Original case held',
    verdict: (beat, equal) =>
      beat  ? 'The original would have been better. Risky move backfired.'
            : equal ? 'Identical players — coin flip either way.'
            : 'The swap paid off. Better player, better ending.',
  },
};

export default function ResultScreen({ result, onPlayAgain }) {
  const config     = OUTCOME_CONFIG[result.kind] ?? OUTCOME_CONFIG.keep;
  const main       = result.player;
  const other      = result.otherPlayer;
  const ring       = rarityAccentGradient(main.rarity);
  const glow       = rarityGlow(main.rarity);
  const badge      = RARITY_BADGE[main.rarity] ?? RARITY_BADGE.Risk;
  const beatOther  = other ? other.score > main.score  : false;
  const equalOther = other ? other.score === main.score : false;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-start pt-12 pb-10 px-5 text-center relative overflow-hidden">

      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[50%] blur-3xl rounded-full opacity-15"
        style={{ background: `radial-gradient(ellipse, ${glow} 0%, transparent 65%)` }}
      />

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-[10px] uppercase tracking-[0.45em] text-gray-600 font-bold mb-3 relative"
      >
        {config.eyebrow}
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-2 relative"
      >
        {config.headline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-gray-500 text-sm mb-8 max-w-xs relative"
      >
        {config.sub}
      </motion.p>

      {/* Main player card */}
      <motion.div
        initial={{ scale: 0.72, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.2 }}
        className={`rounded-3xl p-[2px] bg-gradient-to-br ${ring} relative`}
        style={{ boxShadow: `0 0 60px ${glow}` }}
      >
        <div className="rounded-[22px] bg-[#0A0D16] px-8 sm:px-10 py-7 sm:py-8 min-w-[260px] sm:min-w-[300px]">
          <div className="text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-3 font-bold">
            {config.mainLabel}
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
            {main.name}
          </div>
          <div className="text-gray-500 text-sm mt-2 font-medium">{main.team}</div>
          <div className={`mt-4 inline-block text-[10px] uppercase tracking-[0.3em] font-black px-3 py-1 rounded-full border ${badge}`}>
            {main.rarity}
          </div>
        </div>
      </motion.div>

      {/* Comparison panel */}
      {other && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mt-5 w-full max-w-sm relative"
        >
          <div className="px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            <div className="text-[9px] uppercase tracking-[0.3em] text-gray-600 mb-3 font-bold">
              {config.otherLabel}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="text-left min-w-0">
                <div className="font-bold text-white text-sm truncate">{other.name}</div>
                <div className="text-xs text-gray-500 mt-px">{other.team}</div>
                <div className={`mt-1.5 inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${RARITY_BADGE[other.rarity] ?? RARITY_BADGE.Risk}`}>
                  {other.rarity}
                </div>
              </div>

              <div className={`text-sm font-black shrink-0 ${
                beatOther ? 'text-red-400' : equalOther ? 'text-gray-500' : 'text-emerald-400'
              }`}>
                {beatOther ? '↑ Theirs' : equalOther ? '= Tie' : '↓ Yours'}
              </div>
            </div>

            <div className={`mt-3 text-xs font-medium pt-3 border-t border-white/[0.07] ${
              beatOther ? 'text-red-400' : equalOther ? 'text-gray-500' : 'text-emerald-400'
            }`}>
              {config.verdict(beatOther, equalOther)}
            </div>
          </div>
        </motion.div>
      )}

      {/* Play again */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onPlayAgain}
        className="mt-8 px-12 py-4 rounded-full bg-gradient-to-b from-ice to-blue-600 text-white font-black uppercase tracking-[0.25em] text-sm shadow-[0_12px_32px_rgba(58,190,255,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]"
      >
        Play Again
      </motion.button>
    </div>
  );
}
