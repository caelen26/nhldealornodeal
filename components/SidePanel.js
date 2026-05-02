'use client';
import { tierColor, tierLabel, tierSideTone, tierBadgeSymbol } from '../data/players';

export default function SidePanel({ title, subtitle, players, variant }) {
  return (
    <aside className="w-[19%] min-w-[200px] flex flex-col rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden backdrop-blur-sm">
      <header className="px-4 py-3 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent shrink-0">
        <h2 className="text-[10px] uppercase tracking-[0.28em] text-gray-400 font-bold">{title}</h2>
        <div className="text-sm font-semibold text-white mt-0.5">{subtitle}</div>
      </header>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5">
        {players.length === 0 && (
          <div className="text-xs text-gray-500 italic px-2 py-4 text-center">
            {variant === 'opened' ? 'No cases opened yet.' : 'All players in play.'}
          </div>
        )}
        {players.map((p, i) => {
          const tier = tierColor(p.score);
          const tone = tierSideTone(tier);
          const symbol = tierBadgeSymbol(tier);
          return (
            <div
              key={`${p.name}-${i}`}
              className={`px-2.5 py-1.5 rounded-lg border ${tone} text-xs flex items-center justify-between gap-2`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate leading-tight">{p.name}</div>
                <div className="text-[10px] opacity-70 truncate font-medium">{p.team}</div>
              </div>
              {variant === 'remaining' && (
                <span
                  className="text-[10px] font-black shrink-0 opacity-80"
                  title={tierLabel(p.score)}
                >
                  {symbol}
                </span>
              )}
              {variant === 'opened' && (
                <span className="text-[10px] opacity-50 shrink-0 font-mono">#{p.caseId}</span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
