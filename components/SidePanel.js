'use client';
import { raritySideTone, rarityBadgeSymbol } from '../data/players';

export default function SidePanel({ title, subtitle, players, variant }) {
  return (
    <aside className="w-full flex flex-col rounded-2xl bg-white/[0.02] border border-white/[0.07] overflow-hidden">
      <header className="px-4 py-3 border-b border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent shrink-0">
        <h2 className="text-[9px] uppercase tracking-[0.35em] text-gray-600 font-bold">{title}</h2>
        <div className="text-sm font-bold text-white mt-0.5">{subtitle}</div>
      </header>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {players.length === 0 && (
          <div className="text-xs text-gray-700 italic px-2 py-5 text-center">
            {variant === 'opened' ? 'No cases opened yet.' : 'All players in play.'}
          </div>
        )}

        {players.map((p, i) => {
          const tone   = raritySideTone(p.rarity);
          const symbol = rarityBadgeSymbol(p.rarity);
          return (
            <div
              key={`${p.name}-${i}`}
              className={`px-2.5 py-1.5 rounded-lg border ${tone} text-xs flex items-center justify-between gap-2`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate leading-tight text-[11px]">{p.name}</div>
                <div className="text-[9px] opacity-60 truncate font-medium mt-px">{p.team}</div>
              </div>

              {variant === 'remaining' && (
                <span className="text-[10px] font-black shrink-0 opacity-70" title={p.rarity}>
                  {symbol}
                </span>
              )}
              {variant === 'opened' && (
                <span className="text-[9px] opacity-40 shrink-0 font-mono">#{p.caseId}</span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
