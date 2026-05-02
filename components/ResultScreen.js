'use client';
import { tierColor, tierLabel, tierAccentGradient } from '../data/players';

function PlayerCard({ player, label }) {
  const tier = tierColor(player.score);
  const ring = tierAccentGradient(tier);
  const glowColor =
    tier === 'jackpot' ? 'rgba(255,215,0,0.45)' :
    tier === 'elite'   ? 'rgba(251,146,60,0.40)' :
    tier === 'high'    ? 'rgba(58,190,255,0.38)' :
    tier === 'mid'     ? 'rgba(52,211,153,0.32)' :
                         'rgba(248,113,113,0.28)';
  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">{label}</div>
      )}
      <div
        className={`rounded-2xl p-[2px] bg-gradient-to-br ${ring}`}
        style={{ boxShadow: `0 0 40px ${glowColor}` }}
      >
        <div className="rounded-[14px] bg-[#0B0F1A] px-6 py-5 min-w-[180px] text-center">
          <div className="text-xl font-black text-white leading-tight">{player.name}</div>
          <div className="text-gray-400 text-xs mt-1 font-medium">{player.team}</div>
          <div className="mt-2 inline-block text-[9px] uppercase tracking-[0.3em] font-black px-2 py-0.5 rounded-full border border-white/15 text-gray-300">
            {tierLabel(player.score)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultScreen({ result, onPlayAgain }) {
  const main = result.player;
  const other = result.otherPlayer;
  const tier = tierColor(main.score);
  const ring = tierAccentGradient(tier);
  const glowColor =
    tier === 'jackpot' ? 'rgba(255,215,0,0.40)' :
    tier === 'elite'   ? 'rgba(251,146,60,0.35)' :
    tier === 'high'    ? 'rgba(58,190,255,0.35)' :
    tier === 'mid'     ? 'rgba(52,211,153,0.30)' :
                         'rgba(248,113,113,0.25)';

  // ── Config per result kind ──────────────────────────────────────────────────
  const config = {
    deal: {
      eyebrow: 'Game Over · Deal Accepted',
      headline: "It's a Deal!",
      sub: "You took the banker's offer and walk away with…",
      mainLabel: 'Your Player',
      otherLabel: 'Your case held',
      comparison: (beat, equal) =>
        beat
          ? 'The banker beat you — your case was worth more. Ouch.'
          : equal
          ? 'A perfect tie. Either way the same.'
          : 'Smart deal. The banker paid you more than your case was worth.',
    },
    keep: {
      eyebrow: 'Game Over · You Kept Your Case',
      headline: 'Kept Your Pick!',
      sub: 'You trusted your gut and stayed with your original case.',
      mainLabel: 'Your Player',
      otherLabel: 'The mystery case held',
      comparison: (beat, equal) =>
        beat
          ? "The swap would have been better — but hindsight is 20/20."
          : equal
          ? 'Both cases were equal. You made the right call.'
          : 'Smart keep. Your case was the better one!',
    },
    swap: {
      eyebrow: 'Game Over · You Swapped!',
      headline: 'You Swapped!',
      sub: 'Bold move. You switched cases at the very last second.',
      mainLabel: 'Your Player (Swapped)',
      otherLabel: 'Your original case held',
      comparison: (beat, equal) =>
        beat
          ? "The original would have been better — risky move didn't pay off."
          : equal
          ? 'Identical outcome either way. Coin flip result.'
          : 'The swap paid off! Your new case was the better pick.',
    },
  }[result.kind] ?? {
    eyebrow: 'Game Over',
    headline: 'Final Reveal',
    sub: 'Your case held…',
    mainLabel: 'Your Player',
    otherLabel: null,
    comparison: null,
  };

  const beatOther = other ? other.score > main.score : false;
  const equalOther = other ? other.score === main.score : false;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[55%] blur-3xl rounded-full opacity-25"
        style={{ background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 70%)` }}
      />

      <div className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-3 font-bold">
        {config.eyebrow}
      </div>
      <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tight">{config.headline}</h1>
      <p className="text-gray-400 mb-10 max-w-md">{config.sub}</p>

      {/* Main player card — large */}
      <div
        className={`rounded-3xl p-[2px] bg-gradient-to-br ${ring} animate-modal-in`}
        style={{ boxShadow: `0 0 70px ${glowColor}` }}
      >
        <div className="rounded-[22px] bg-[#0B0F1A] px-10 py-8 min-w-[280px]">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2 font-bold">
            {config.mainLabel}
          </div>
          <div className="text-3xl md:text-4xl font-black text-white leading-tight">
            {main.name}
          </div>
          <div className="text-gray-400 mt-2 font-medium">{main.team}</div>
          <div className="mt-4 inline-block text-[10px] uppercase tracking-[0.3em] font-black px-3 py-1 rounded-full border border-white/15 text-gray-300">
            {tierLabel(main.score)}
          </div>
        </div>
      </div>

      {/* Other case comparison */}
      {other && config.otherLabel && (
        <div className="mt-7 max-w-sm mx-auto w-full">
          <div className="px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2 font-bold">
              {config.otherLabel}
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-left">
                <div className="font-bold text-white">{other.name}</div>
                <div className="text-xs text-gray-400">{other.team}</div>
              </div>
              <div
                className={`text-xs font-semibold shrink-0 ${
                  beatOther ? 'text-red-400' : equalOther ? 'text-gray-400' : 'text-emerald-400'
                }`}
              >
                {beatOther ? '↑ Better' : equalOther ? '= Equal' : '↓ Worse'}
              </div>
            </div>
            {config.comparison && (
              <div
                className={`mt-3 text-xs font-medium border-t border-white/[0.08] pt-3 ${
                  beatOther ? 'text-red-400' : equalOther ? 'text-gray-400' : 'text-emerald-400'
                }`}
              >
                {config.comparison(beatOther, equalOther)}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onPlayAgain}
        className="mt-10 px-10 py-4 rounded-full bg-gradient-to-b from-ice to-blue-600 text-white font-black uppercase tracking-[0.25em] text-sm shadow-[0_10px_30px_rgba(58,190,255,0.45)] hover:scale-105 active:scale-95 transition"
      >
        Play Again
      </button>
    </div>
  );
}
