'use client';
import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { NHL_PLAYERS } from '../data/players';
import CaseGrid from './CaseGrid';
import SidePanel from './SidePanel';
import BankerModal from './BankerModal';
import SwapModal from './SwapModal';
import ResultScreen from './ResultScreen';

// Banker fires after each of these cumulative open counts (every 5)
const ROUND_BREAKPOINTS = [5, 10, 15, 20];

// Base multipliers per banker round — lowballs early, accurate late
const BASE_MULTIPLIERS = [0.52, 0.68, 0.82, 0.94];

// Swap screen triggers when this many cases have been opened (1 mystery left)
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

// Smart banker: lowballs early, accurate late; bonus for high-rarity-heavy boards
function computeBankerOffer(remaining, roundIndex) {
  if (remaining.length === 0) return null;

  const avg = remaining.reduce((s, c) => s + c.player.score, 0) / remaining.length;

  // Bonus: up to +0.20 when most remaining cases are Superstar+ (score >= 86)
  const topCount = remaining.filter((c) => c.player.score >= 86).length;
  const topBonus = (topCount / remaining.length) * 0.20;

  const base       = BASE_MULTIPLIERS[roundIndex] ?? 0.94;
  const multiplier = Math.min(base + topBonus, 1.06);
  const target     = avg * multiplier;

  return pickClosestPlayer(target);
}

export default function GameBoard() {
  const [phase, setPhase]           = useState('start');
  const [cases, setCases]           = useState(buildCases);
  const [playerCaseId, setPlayerCaseId] = useState(null);
  const [openedOrder, setOpenedOrder]   = useState([]);
  const [bankerOffer, setBankerOffer]   = useState(null);
  const [roundIndex, setRoundIndex]     = useState(0);
  const [endResult, setEndResult]       = useState(null);
  const [swapCaseData, setSwapCaseData] = useState(null);

  const reset = useCallback(() => {
    setCases(buildCases());
    setPlayerCaseId(null);
    setOpenedOrder([]);
    setBankerOffer(null);
    setRoundIndex(0);
    setEndResult(null);
    setSwapCaseData(null);
    setPhase('start');
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

    // Banker check
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

    // Swap trigger: SWAP_TRIGGER opens = 1 mystery case left + player's case
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

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === 'start') return <StartScreen onStart={handleStart} />;

  if (phase === 'end-deal' || phase === 'end-nodeal') {
    return <ResultScreen result={endResult} onPlayAgain={reset} />;
  }

  const phaseLabel = {
    select:  'Pick your case',
    opening: 'Open cases',
    banker:  'Banker is calling…',
    swap:    'Final choice!',
  }[phase];

  const opensThisRound =
    openedOrder.length - (roundIndex > 0 ? ROUND_BREAKPOINTS[roundIndex - 1] : 0);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar phaseLabel={phaseLabel} round={Math.min(roundIndex + 1, 4)} phase={phase} />

      <div className="flex-1 flex gap-3 md:gap-4 px-3 md:px-4 py-3 max-w-[1800px] w-full mx-auto">
        <SidePanel
          title="Remaining Players"
          subtitle={`${remainingPlayers.length} still in play`}
          players={[...remainingPlayers].sort((a, b) => b.score - a.score)}
          variant="remaining"
        />

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

        <SidePanel
          title="Opened Cases"
          subtitle={`${openedPlayers.length} revealed`}
          players={openedPlayers}
          variant="opened"
        />
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
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StartScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-ice/[0.07] blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[40%] bg-red-500/[0.04] blur-3xl rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <div className="text-[11px] uppercase tracking-[0.4em] text-gray-500 mb-4 font-bold">
          The NHL Game Show
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-3 leading-[0.95]">
          <span className="bg-gradient-to-b from-ice to-blue-500 bg-clip-text text-transparent">DEAL</span>
          <span className="text-gray-500 mx-3">or</span>
          <span className="bg-gradient-to-b from-red-400 to-red-600 bg-clip-text text-transparent">NO DEAL</span>
        </h1>

        <div className="text-3xl md:text-4xl font-black tracking-[0.3em] text-white/90 mb-8">
          N · H · L
        </div>

        <p className="text-gray-400 text-base md:text-lg mb-12 max-w-xl leading-relaxed">
          26 briefcases. 26 NHL stars. One chance to outsmart the banker.
          Pick a case, beat the average, and walk away with the best player you can.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-12 py-5 rounded-full bg-gradient-to-b from-ice to-blue-600 text-white font-black text-lg uppercase tracking-[0.3em] shadow-[0_10px_36px_rgba(58,190,255,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]"
        >
          Start Game
        </motion.button>

        <div className="mt-10 text-xs text-gray-600 max-w-md leading-relaxed">
          Banker offers appear every 5 cases. Offers get sharper when top players are still in play.
          At 2 cases left, choose to keep or swap.
        </div>
      </motion.div>
    </div>
  );
}

function TopBar({ phaseLabel, round, phase }) {
  return (
    <div className="border-b border-white/10 backdrop-blur-md bg-navy/70 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl md:text-2xl font-black tracking-tight">
          <span className="bg-gradient-to-b from-ice to-blue-500 bg-clip-text text-transparent">NHL</span>{' '}
          <span className="text-white">Deal or No Deal</span>
        </h1>
        <span className="hidden md:inline text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold">
          Game Show
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {phase !== 'select' && phase !== 'swap' && (
          <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold hidden sm:block">
            Round {round} <span className="text-gray-700">/ 4</span>
          </div>
        )}
        <div className={[
          'px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold border transition-colors',
          phase === 'banker' ? 'bg-red-500/15 border-red-400/40 text-red-300'
            : phase === 'swap' ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 animate-pulse'
            : 'bg-ice/10 border-ice/40 text-ice',
        ].join(' ')}>
          {phaseLabel}
        </div>
      </div>
    </div>
  );
}

function BottomBar({ phase, opensThisRound, roundIndex, openedTotal }) {
  let prompt = '';
  let accent = 'text-gray-300';

  if (phase === 'select') {
    prompt = 'Click a briefcase to keep as your own. Its player will be revealed at the very end — unless you take a deal.';
    accent = 'text-ice';
  } else if (phase === 'opening') {
    const casesLeft = SWAP_TRIGGER - openedTotal;
    if (roundIndex >= ROUND_BREAKPOINTS.length) {
      prompt =
        casesLeft <= 0
          ? 'Make your final choice…'
          : `Almost there. Open ${casesLeft} more ${casesLeft === 1 ? 'case' : 'cases'} — then you choose to keep or swap.`;
      accent = 'text-amber-300';
    } else {
      const toNextBanker = 5 - opensThisRound;
      prompt = `Open ${toNextBanker} more case${toNextBanker === 1 ? '' : 's'} before the banker calls.`;
    }
  } else if (phase === 'banker') {
    prompt = 'The banker is on the line. The offer improves when high-rarity players are still out there.';
    accent = 'text-red-300';
  } else if (phase === 'swap') {
    prompt = 'One mystery case remains. Keep your original pick — or make the switch.';
    accent = 'text-amber-300';
  }

  return (
    <div className={`mt-3 mx-auto max-w-3xl text-center text-sm md:text-base px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] ${accent}`}>
      {prompt}
    </div>
  );
}
