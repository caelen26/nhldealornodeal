'use client';
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NHL_PLAYERS, raritySideTone, rarityBadgeSymbol } from '../data/players';
import CaseGrid from './CaseGrid';
import SidePanel from './SidePanel';
import BankerModal from './BankerModal';
import SwapModal from './SwapModal';
import ResultScreen from './ResultScreen';

const ROUND_BREAKPOINTS = [5, 10, 15, 20];
const BASE_MULTIPLIERS  = [0.52, 0.68, 0.82, 0.94];
const SWAP_TRIGGER = 24;

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCases() {
  return shuffle(NHL_PLAYERS).map((p, i) => ({ id: i + 1, player: p, opened: false }));
}

function pickClosestPlayer(target) {
  let best = NHL_PLAYERS[0];
  let bestDist = Math.abs(NHL_PLAYERS[0].score - target);
  for (const p of NHL_PLAYERS) {
    const d = Math.abs(p.score - target);
    if (d < bestDist) { bestDist = d; best = p; }
  }
  return best;
}

function computeBankerOffer(remaining, roundIndex) {
  if (remaining.length === 0) return null;
  const avg = remaining.reduce((s, c) => s + c.player.score, 0) / remaining.length;
  const topCount = remaining.filter((c) => c.player.score >= 86).length;
  const topBonus = (topCount / remaining.length) * 0.20;
  const base       = BASE_MULTIPLIERS[roundIndex] ?? 0.94;
  const multiplier = Math.min(base + topBonus, 1.06);
  return pickClosestPlayer(avg * multiplier);
}

export default function GameBoard() {
  const [phase, setPhase]               = useState('start');
  const [cases, setCases]               = useState(buildCases);
  const [playerCaseId, setPlayerCaseId] = useState(null);
  const [openedOrder, setOpenedOrder]   = useState([]);
  const [bankerOffer, setBankerOffer]   = useState(null);
  const [roundIndex, setRoundIndex]     = useState(0);
  const [endResult, setEndResult]       = useState(null);
  const [swapCaseData, setSwapCaseData] = useState(null);
  const [mobileDrawer, setMobileDrawer] = useState(null);

  const reset = useCallback(() => {
    setCases(buildCases());
    setPlayerCaseId(null);
    setOpenedOrder([]);
    setBankerOffer(null);
    setRoundIndex(0);
    setEndResult(null);
    setSwapCaseData(null);
    setPhase('start');
    setMobileDrawer(null);
  }, []);

  const remainingPlayers = useMemo(
    () => cases.filter((c) => !c.opened).map((c) => c.player),
    [cases]
  );

  const openedPlayers = useMemo(
    () => openedOrder.map((id) => {
      const c = cases.find((x) => x.id === id);
      return { ...c.player, caseId: id };
    }),
    [openedOrder, cases]
  );

  const handleStart  = () => setPhase('select');
  const handleSelect = (id) => {
    if (phase !== 'select') return;
    setPlayerCaseId(id);
    setPhase('opening');
  };

  const handleOpen = (id) => {
    if (phase !== 'opening' || id === playerCaseId) return;
    const target = cases.find((c) => c.id === id);
    if (!target || target.opened) return;

    const nextCases  = cases.map((c) => (c.id === id ? { ...c, opened: true } : c));
    const nextOpened = [...openedOrder, id];
    setCases(nextCases);
    setOpenedOrder(nextOpened);

    if (
      roundIndex < ROUND_BREAKPOINTS.length &&
      nextOpened.length === ROUND_BREAKPOINTS[roundIndex]
    ) {
      setTimeout(() => {
        const openedIds = new Set(nextOpened);
        const remaining = nextCases.filter((c) => !openedIds.has(c.id));
        const offer     = computeBankerOffer(remaining, roundIndex);
        if (offer) { setBankerOffer(offer); setPhase('banker'); }
      }, 750);
      return;
    }

    if (nextOpened.length === SWAP_TRIGGER) {
      setTimeout(() => {
        const openedIds = new Set(nextOpened);
        const mystery   = nextCases.find((c) => !openedIds.has(c.id) && c.id !== playerCaseId);
        setSwapCaseData(mystery);
        setPhase('swap');
      }, 900);
    }
  };

  const handleDeal = () => {
    const playerCase = cases.find((c) => c.id === playerCaseId);
    setEndResult({ kind: 'deal', player: bankerOffer, otherPlayer: playerCase.player });
    setPhase('end-deal');
  };

  const handleNoDeal = () => {
    setBankerOffer(null);
    setRoundIndex((i) => i + 1);
    setPhase('opening');
  };

  const handleKeep = () => {
    const playerCase = cases.find((c) => c.id === playerCaseId);
    setEndResult({ kind: 'keep', player: playerCase.player, otherPlayer: swapCaseData.player });
    setPhase('end-nodeal');
  };

  const handleSwap = () => {
    const playerCase = cases.find((c) => c.id === playerCaseId);
    setEndResult({ kind: 'swap', player: swapCaseData.player, otherPlayer: playerCase.player });
    setPhase('end-nodeal');
  };

  if (phase === 'start') return <StartScreen onStart={handleStart} />;

  if (phase === 'end-deal' || phase === 'end-nodeal') {
    return <ResultScreen result={endResult} onPlayAgain={reset} />;
  }

  const phaseLabel = {
    select:  'Pick your case',
    opening: 'Open cases',
    banker:  'Banker calling…',
    swap:    'Final choice!',
  }[phase];

  const opensThisRound =
    openedOrder.length - (roundIndex > 0 ? ROUND_BREAKPOINTS[roundIndex - 1] : 0);

  const sortedRemaining = [...remainingPlayers].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <TopBar
        phaseLabel={phaseLabel}
        round={Math.min(roundIndex + 1, 4)}
        phase={phase}
        remainingCount={remainingPlayers.length}
        openedCount={openedPlayers.length}
        onShowDrawer={setMobileDrawer}
      />

      <div className="flex-1 flex gap-3 md:gap-4 px-3 md:px-4 py-3 max-w-[1800px] w-full mx-auto">

        {/* Side panels — desktop only */}
        <div className="hidden md:flex flex-col w-[18%] min-w-[190px]">
          <SidePanel
            title="Remaining Players"
            subtitle={`${remainingPlayers.length} in play`}
            players={sortedRemaining}
            variant="remaining"
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <CaseGrid
            cases={cases}
            playerCaseId={playerCaseId}
            phase={phase}
            onSelect={handleSelect}
            onOpen={handleOpen}
          />
          <BottomBar
            phase={phase}
            opensThisRound={opensThisRound}
            roundIndex={roundIndex}
            openedTotal={openedOrder.length}
          />
        </div>

        <div className="hidden md:flex flex-col w-[18%] min-w-[190px]">
          <SidePanel
            title="Opened Cases"
            subtitle={`${openedPlayers.length} revealed`}
            players={openedPlayers}
            variant="opened"
          />
        </div>
      </div>

      {phase === 'banker' && bankerOffer && (
        <BankerModal offer={bankerOffer} onDeal={handleDeal} onNoDeal={handleNoDeal} round={roundIndex + 1} />
      )}

      {phase === 'swap' && swapCaseData && (
        <SwapModal
          playerCaseId={playerCaseId}
          otherCase={swapCaseData}
          onKeep={handleKeep}
          onSwap={handleSwap}
        />
      )}

      {/* Mobile player drawer */}
      <AnimatePresence>
        {mobileDrawer && (
          <MobileDrawer
            variant={mobileDrawer}
            players={mobileDrawer === 'remaining' ? sortedRemaining : openedPlayers}
            onClose={() => setMobileDrawer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StartScreen({ onStart }) {
  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden">

      {/* Background lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[60%] rounded-full bg-ice/[0.055] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[45%] rounded-full bg-blue-900/30 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] rounded-full bg-red-900/20 blur-[80px]" />
        {/* Ice rink lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/[0.03]" />
      </div>

      {/* Brand line */}
      <div className="relative px-6 pt-5">
        <div className="text-[10px] uppercase tracking-[0.45em] text-gray-600 font-bold">NHL · 2025 Game Show</div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Headline */}
          <h1 className="font-black tracking-tight mb-8 leading-[0.88]">
            <span className="block text-[clamp(4rem,15vw,9.5rem)] text-white">
              DEAL
            </span>
            <span className="block text-[clamp(0.9rem,3.5vw,2rem)] text-white/20 tracking-[0.6em] uppercase font-black my-2">
              or
            </span>
            <span className="block text-[clamp(2.5rem,9vw,5.5rem)] bg-gradient-to-b from-red-400 to-red-700 bg-clip-text text-transparent">
              NO DEAL
            </span>
          </h1>

          {/* Stats */}
          <div className="flex items-center gap-5 mb-11">
            <StatPill value="26" label="Stars" />
            <div className="w-px h-10 bg-white/[0.08]" />
            <StatPill value="4" label="Rounds" />
            <div className="w-px h-10 bg-white/[0.08]" />
            <StatPill value="1" label="Winner" />
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="px-14 py-4 rounded-full bg-gradient-to-b from-ice to-blue-600 text-white font-black text-base uppercase tracking-[0.3em] shadow-[0_14px_44px_rgba(58,190,255,0.45),inset_0_1px_0_rgba(255,255,255,0.28)]"
          >
            Start Game
          </motion.button>
        </motion.div>
      </div>

      {/* Footer note */}
      <div className="relative px-6 pb-7 text-center text-[11px] text-gray-700 tracking-wide">
        Banker offers every 5 opens · Keep or swap at the end
      </div>
    </div>
  );
}

function StatPill({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-[2.4rem] font-black text-ice tabular-nums leading-none">{value}</div>
      <div className="text-[9px] uppercase tracking-[0.35em] text-gray-600 mt-1">{label}</div>
    </div>
  );
}

function TopBar({ phaseLabel, round, phase, remainingCount, openedCount, onShowDrawer }) {
  return (
    <div className="border-b border-white/[0.07] bg-[#0B0F1A]/85 backdrop-blur-md px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">

      <div className="flex items-baseline gap-2.5">
        <h1 className="text-lg md:text-xl font-black tracking-tight">
          <span className="bg-gradient-to-b from-ice to-blue-400 bg-clip-text text-transparent">NHL</span>
          {' '}
          <span className="text-white">Deal or No Deal</span>
        </h1>
      </div>

      {/* Desktop right side */}
      <div className="hidden md:flex items-center gap-4">
        {phase !== 'select' && phase !== 'swap' && (
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold">
            Round {round}<span className="text-gray-700 ml-0.5">/4</span>
          </span>
        )}
        <PhaseBadge phase={phase} label={phaseLabel} />
      </div>

      {/* Mobile right side — tappable count pills open the drawer */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => onShowDrawer('remaining')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ice/10 border border-ice/20 active:bg-ice/20"
        >
          <span className="text-sm font-black text-ice tabular-nums">{remainingCount}</span>
          <span className="text-[9px] uppercase tracking-wide text-ice/60 font-bold">left</span>
        </button>
        {openedCount > 0 && (
          <button
            onClick={() => onShowDrawer('opened')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.09] active:bg-white/[0.08]"
          >
            <span className="text-sm font-black text-gray-300 tabular-nums">{openedCount}</span>
            <span className="text-[9px] uppercase tracking-wide text-gray-600 font-bold">open</span>
          </button>
        )}
      </div>
    </div>
  );
}

function PhaseBadge({ phase, label }) {
  return (
    <div className={[
      'px-3 py-1.5 rounded-full text-xs font-bold border',
      phase === 'banker'
        ? 'bg-red-500/15 border-red-400/35 text-red-300'
        : phase === 'swap'
        ? 'bg-amber-500/15 border-amber-400/35 text-amber-300'
        : 'bg-ice/10 border-ice/25 text-ice',
    ].join(' ')}>
      {label}
    </div>
  );
}

function BottomBar({ phase, opensThisRound, roundIndex, openedTotal }) {
  let prompt = '';
  let accent = 'text-gray-400';
  let showDots = false;

  if (phase === 'select') {
    prompt = 'Choose a briefcase — its player stays secret until the very end.';
    accent = 'text-ice';
  } else if (phase === 'opening') {
    const casesLeft = SWAP_TRIGGER - openedTotal;
    if (roundIndex >= ROUND_BREAKPOINTS.length) {
      prompt = casesLeft <= 0
        ? 'Make your final choice…'
        : `${casesLeft} more case${casesLeft === 1 ? '' : 's'} — then keep or swap.`;
      accent = 'text-amber-300';
    } else {
      const toNext = 5 - opensThisRound;
      prompt = `${toNext} more case${toNext === 1 ? '' : 's'} until the banker calls.`;
      showDots = true;
    }
  } else if (phase === 'banker') {
    prompt = 'The banker is on the line.';
    accent = 'text-red-300';
  } else if (phase === 'swap') {
    prompt = 'One mystery case remains. Keep or switch?';
    accent = 'text-amber-300';
  }

  return (
    <div className={`mt-3 mx-auto max-w-xl w-full text-center text-sm px-5 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06] ${accent}`}>
      {showDots && (
        <div className="flex justify-center gap-1.5 mb-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i < opensThisRound ? 'bg-ice scale-110' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      )}
      {prompt}
    </div>
  );
}

function MobileDrawer({ variant, players, onClose }) {
  const isRemaining = variant === 'remaining';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="md:hidden fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="md:hidden fixed bottom-0 inset-x-0 z-50 rounded-t-2xl bg-[#0e1323] border-t border-white/[0.09] max-h-[72vh] flex flex-col"
      >
        {/* Pull handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 flex items-start justify-between border-b border-white/[0.07]">
          <div>
            <h3 className="font-black text-white text-base leading-tight">
              {isRemaining ? 'Remaining Players' : 'Opened Cases'}
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {players.length} {isRemaining ? 'still in play' : 'revealed so far'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-gray-500 text-xs mt-0.5"
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-1.5 pb-safe-bottom">
          {players.length === 0 && (
            <div className="text-xs text-gray-600 italic text-center py-6">
              {isRemaining ? 'All players revealed.' : 'No cases opened yet.'}
            </div>
          )}
          {players.map((p, i) => {
            const tone   = raritySideTone(p.rarity);
            const symbol = rarityBadgeSymbol(p.rarity);
            return (
              <div
                key={`${p.name}-${i}`}
                className={`px-3 py-2.5 rounded-xl border ${tone} flex items-center justify-between gap-3`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate leading-tight">{p.name}</div>
                  <div className="text-[10px] opacity-55 truncate mt-px">{p.team}</div>
                </div>
                <span className="text-sm shrink-0 opacity-65 font-mono">
                  {isRemaining ? symbol : `#${p.caseId}`}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
