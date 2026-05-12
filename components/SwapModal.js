'use client';
import { motion } from 'framer-motion';

export default function SwapModal({ playerCaseId, otherCase, onKeep, onSwap }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 12 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 340, damping: 24, delay: 0.05 }}
        className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#161d30] to-[#0B0F1A] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden"
      >

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center border-b border-white/10 relative">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="text-[10px] tracking-[0.4em] uppercase text-red-400 font-black mb-1"
          >
            Final Choice
          </motion.div>
          <h3 className="text-3xl font-black tracking-tight text-white">One Case Remains</h3>
          <p className="text-gray-400 text-sm mt-1">
            Do you stick with your gut, or make the switch?
          </p>
          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 h-px w-48 bg-gradient-to-r from-transparent via-red-400 to-transparent" />
        </div>

        {/* Cases */}
        <div className="px-6 pt-6 pb-4 grid grid-cols-2 gap-5">
          {/* Player's case */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-full aspect-[4/5] rounded-2xl bg-gradient-to-br from-blue-200 via-sky-400 to-blue-700 border-2 border-sky-300 shadow-[0_0_28px_rgba(57,189,248,0.55)] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-x-3 top-2 h-px bg-white/50 rounded-full" />
              <div className="absolute inset-x-3 bottom-2 h-px bg-black/25 rounded-full" />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-black/30 rounded-r" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-black/30 rounded-l" />
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-3 rounded-sm bg-black/20 border border-white/15" />
              <span className="relative text-4xl font-black text-white drop-shadow">{playerCaseId}</span>
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/10 blur-sm rounded-t-2xl" />
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.3em] text-sky-400 font-black">Your Case</div>
              <div className="text-xs text-gray-500 mt-0.5">Mystery inside</div>
            </div>
          </div>

          {/* Mystery case */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-full aspect-[4/5] rounded-2xl bg-gradient-to-br from-slate-300 via-slate-500 to-slate-800 border-2 border-white/25 shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-x-3 top-2 h-px bg-white/50 rounded-full" />
              <div className="absolute inset-x-3 bottom-2 h-px bg-black/25 rounded-full" />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-black/30 rounded-r" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-black/30 rounded-l" />
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-3 rounded-sm bg-black/20 border border-white/15" />
              <span className="relative text-4xl font-black text-slate-200 drop-shadow">{otherCase.id}</span>
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/10 blur-sm rounded-t-2xl" />
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Mystery Case</div>
              <div className="text-xs text-gray-600 mt-0.5">Unknown player</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 pb-2 px-6">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-gray-600 text-sm tracking-widest">⇄</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 grid grid-cols-2 gap-3 mt-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onKeep}
            className="py-4 rounded-xl font-black tracking-[0.15em] uppercase text-sm bg-gradient-to-b from-sky-400 to-blue-700 text-white shadow-[0_8px_24px_rgba(57,189,248,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            Keep Mine
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onSwap}
            className="py-4 rounded-xl font-black tracking-[0.15em] uppercase text-sm bg-gradient-to-b from-amber-400 to-orange-700 text-white shadow-[0_8px_24px_rgba(251,146,60,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            Swap Cases
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
