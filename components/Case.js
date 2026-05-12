'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { rarityCardSkin } from '../data/players';

// Rarity badge colors (tailwind-safe)
const RARITY_BADGE = {
  GOAT:      { pill: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50',  glow: 'shadow-[0_0_10px_rgba(255,215,0,0.6)]'  },
  Elite:     { pill: 'bg-purple-400/20 text-purple-200 border-purple-400/50',  glow: 'shadow-[0_0_10px_rgba(139,92,246,0.6)]' },
  Superstar: { pill: 'bg-sky-400/20    text-sky-200    border-sky-400/50',     glow: 'shadow-[0_0_10px_rgba(57,189,248,0.55)]'},
  Solid:     { pill: 'bg-slate-400/20  text-slate-200  border-slate-400/40',   glow: ''                                        },
  Risk:      { pill: 'bg-red-500/20    text-red-300    border-red-500/40',     glow: ''                                        },
};

export default function Case({ data, isPlayerCase, phase, onSelect, onOpen }) {
  const { id, player, opened } = data;
  const selectable = phase === 'select';
  const openable   = phase === 'opening' && !isPlayerCase && !opened;
  const interactive = selectable || openable;

  const handleClick = () => {
    if (selectable) onSelect(id);
    else if (openable) onOpen(id);
  };

  return (
    // Fixed-width wrapper so columns stay stable during animations
    <div className="w-[60px] md:w-[66px] lg:w-[72px] aspect-[4/5]">
      <AnimatePresence mode="wait" initial={false}>
        {opened ? (
          <RevealCard key="open" player={player} id={id} />
        ) : (
          <ClosedCase
            key="closed"
            id={id}
            isPlayerCase={isPlayerCase}
            interactive={interactive}
            dimmed={!interactive && !isPlayerCase}
            onClick={handleClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Closed briefcase ───────────────────────────────────────────────────────────

function ClosedCase({ id, isPlayerCase, interactive, dimmed, onClick }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      disabled={!interactive && !isPlayerCase ? true : undefined}
      whileHover={interactive ? { scale: 1.07, y: -2 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={[
        'relative w-full h-full rounded-xl overflow-hidden select-none',
        'border transition-opacity duration-200',
        // Metallic silver base
        isPlayerCase
          ? 'bg-gradient-to-br from-blue-200 via-sky-400 to-blue-700 border-sky-300 shadow-[0_0_22px_rgba(57,189,248,0.7),inset_0_1px_0_rgba(255,255,255,0.5)] animate-pulse-glow'
          : 'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_16px_rgba(0,0,0,0.5)]',
        interactive
          ? 'cursor-pointer hover:border-sky-400/70 hover:shadow-[0_0_20px_rgba(57,189,248,0.45),inset_0_1px_0_rgba(255,255,255,0.6)]'
          : 'cursor-default',
        dimmed ? 'opacity-45' : 'opacity-100',
      ].join(' ')}
      aria-label={`Case ${id}`}
    >
      {/* Shine line top */}
      <div className="absolute inset-x-2 top-1.5 h-px bg-white/55 rounded-full" />
      {/* Shine line bottom */}
      <div className="absolute inset-x-2 bottom-1.5 h-px bg-black/20 rounded-full" />
      {/* Handle studs */}
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-3 bg-black/30 rounded-r" />
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[3px] h-3 bg-black/30 rounded-l" />
      {/* Lock plate */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-2.5 rounded-sm bg-black/20 border border-white/15" />

      {/* Hover glow overlay */}
      {interactive && (
        <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl">
          <div className="absolute -inset-y-2 -left-1/2 w-1/3 bg-white/20 blur-md animate-shine" />
        </div>
      )}

      {/* Case number */}
      <span className="relative z-10 text-xl md:text-2xl font-black drop-shadow-sm text-slate-900">
        {id}
      </span>

      {/* "Yours" badge */}
      {isPlayerCase && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.25em] font-black text-white bg-black/40 px-1.5 py-0.5 rounded whitespace-nowrap">
          Yours
        </span>
      )}
    </motion.button>
  );
}

// ── Opened player reveal card ─────────────────────────────────────────────────

function RevealCard({ player, id }) {
  const skin   = rarityCardSkin(player.rarity);
  const badge  = RARITY_BADGE[player.rarity] ?? RARITY_BADGE.Risk;
  const isGoat = player.rarity === 'GOAT';

  return (
    <motion.div
      key="open"
      initial={{ scale: 0.35, opacity: 0, rotateY: 90 }}
      animate={{ scale: 1,    opacity: 1, rotateY: 0  }}
      exit={{    scale: 0.6,  opacity: 0              }}
      transition={{ type: 'spring', stiffness: 320, damping: 20, duration: 0.5 }}
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
      className={[
        'relative w-full h-full rounded-xl border overflow-hidden',
        'flex flex-col items-center justify-center p-1',
        skin,
      ].join(' ')}
    >
      {/* Top highlight */}
      <div className="pointer-events-none absolute -top-px inset-x-2 h-px bg-white/60 rounded-full" />

      {/* Case number */}
      <div className="text-[7px] uppercase tracking-[0.2em] opacity-50 font-bold">#{id}</div>

      {/* Player name */}
      <div className="font-extrabold text-[10px] sm:text-[11px] text-center leading-tight mt-0.5 px-1">
        {player.name}
      </div>

      {/* Team */}
      <div className="text-[8px] sm:text-[9px] mt-0.5 opacity-80 text-center px-1 leading-tight font-medium">
        {player.team}
      </div>

      {/* Rarity badge */}
      <div className={[
        'mt-1.5 text-[7px] uppercase tracking-[0.15em] font-black px-1.5 py-0.5 rounded border',
        badge.pill,
        badge.glow,
      ].join(' ')}>
        {player.rarity}
      </div>

      {/* GOAT crown */}
      {isGoat && (
        <div className="absolute top-0.5 right-0.5 text-[9px] font-black bg-black/30 text-yellow-200 px-1 py-px rounded leading-none">
          ★
        </div>
      )}
    </motion.div>
  );
}
