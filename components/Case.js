'use client';
import { tierColor, tierLabel, tierCardSkin } from '../data/players';

export default function Case({ data, isPlayerCase, phase, onSelect, onOpen }) {
  const { id, player, opened } = data;
  const selectable = phase === 'select';
  const openable = phase === 'opening' && !isPlayerCase && !opened;

  const handleClick = () => {
    if (selectable) onSelect(id);
    else if (openable) onOpen(id);
  };

  if (opened) {
    const tier = tierColor(player.score);
    const skin = tierCardSkin(tier);
    return (
      <div
        className={`relative aspect-[4/5] rounded-xl border ${skin} flex flex-col items-center justify-center p-1.5 shadow-lg overflow-hidden animate-fade-up`}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-px inset-x-2 h-px bg-white/50 rounded-full" />
          <div className="absolute -bottom-px inset-x-2 h-px bg-black/20 rounded-full" />
        </div>
        <div className="text-[9px] uppercase tracking-[0.25em] opacity-60 font-bold">#{id}</div>
        <div className="font-extrabold text-[11px] sm:text-xs md:text-sm text-center leading-tight mt-1 px-1">
          {player.name}
        </div>
        <div className="text-[9px] sm:text-[10px] mt-1 opacity-80 text-center px-1 leading-tight font-medium">
          {player.team}
        </div>
        <div className="mt-1.5 text-[8px] uppercase tracking-[0.18em] font-black px-1.5 py-0.5 rounded bg-black/25">
          {tierLabel(player.score)}
        </div>
        {tier === 'jackpot' && (
          <div className="absolute top-0.5 right-0.5 text-[9px] font-black bg-black/40 text-yellow-100 px-1 py-0.5 rounded">
            ★
          </div>
        )}
      </div>
    );
  }

  const base =
    'group relative aspect-[4/5] rounded-xl flex items-center justify-center font-black text-2xl md:text-3xl select-none transition-all duration-200 border overflow-hidden';
  const idle =
    'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 text-slate-900 border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_18px_rgba(0,0,0,0.45)] cursor-pointer hover:scale-[1.06] hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(58,190,255,0.55),inset_0_1px_0_rgba(255,255,255,0.6)]';
  const playerSel =
    'bg-gradient-to-br from-blue-200 via-ice to-blue-700 text-white border-ice scale-[1.06] -translate-y-0.5 animate-pulse-glow cursor-default';
  const dimmed = 'opacity-50 cursor-not-allowed';

  let cls = base;
  if (isPlayerCase)       cls += ' ' + playerSel;
  else if (selectable || openable) cls += ' ' + idle;
  else                    cls += ' ' + idle + ' ' + dimmed;

  return (
    <button onClick={handleClick} className={cls} aria-label={`Case ${id}`}>
      <div className="absolute inset-x-2 top-1.5 h-px bg-white/50 rounded-full" />
      <div className="absolute inset-x-2 bottom-1.5 h-px bg-black/25 rounded-full" />
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-3 bg-black/30 rounded-r" />
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-3 bg-black/30 rounded-l" />
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -inset-y-2 -left-1/2 w-1/3 bg-white/25 blur-md animate-shine" />
      </div>
      <span className="relative drop-shadow-sm">{id}</span>
      {isPlayerCase && (
        <span className="absolute bottom-1 text-[9px] uppercase tracking-[0.25em] font-black text-white bg-black/40 px-2 py-0.5 rounded">
          Yours
        </span>
      )}
    </button>
  );
}
