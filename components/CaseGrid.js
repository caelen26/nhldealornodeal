'use client';
import Case from './Case';

export default function CaseGrid({ cases, playerCaseId, phase, onSelect, onOpen }) {
  // Theatrical stage: 7 + 6 | center | 6 + 7
  const colL1 = cases.slice(0, 7);
  const colL2 = cases.slice(7, 13);
  const colR1 = cases.slice(13, 19);
  const colR2 = cases.slice(19, 26);

  const caseProps = (c) => ({
    isPlayerCase: c.id === playerCaseId,
    phase,
    onSelect,
    onOpen,
  });

  return (
    <div className="flex-1 relative overflow-hidden">

      {/* Stage atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-[70%] rounded-full bg-ice/[0.06] blur-[80px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[30%] rounded-full bg-blue-900/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-3 bg-black/50 blur-xl rounded-full" />
      </div>

      {/* Mobile: 4-column grid */}
      <div className="md:hidden grid grid-cols-4 min-[480px]:grid-cols-5 gap-2.5 p-3 relative z-10">
        {cases.map((c) => (
          <Case key={c.id} data={c} {...caseProps(c)} mobile />
        ))}
      </div>

      {/* Desktop: theatrical 4-column stage */}
      <div className="hidden md:flex items-start justify-between h-full py-5 px-4 gap-2 relative z-10">

        {/* Left outer — 7 cases */}
        <div className="flex gap-2 shrink-0">
          <div className="flex flex-col gap-[7px] w-[66px] lg:w-[72px]">
            {colL1.map((c) => (
              <Case key={c.id} data={c} {...caseProps(c)} />
            ))}
          </div>
          {/* Left inner — 6 cases, staggered */}
          <div className="flex flex-col gap-[7px] mt-10 w-[66px] lg:w-[72px]">
            {colL2.map((c) => (
              <Case key={c.id} data={c} {...caseProps(c)} />
            ))}
          </div>
        </div>

        {/* Center stage */}
        <div className="flex-1 self-stretch flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="opacity-[0.05] text-[11px] uppercase tracking-[0.6em] text-white font-black text-center leading-loose">
            NHL<br />Deal or No Deal
          </div>
        </div>

        {/* Right inner — 6 cases, staggered */}
        <div className="flex gap-2 shrink-0">
          <div className="flex flex-col gap-[7px] mt-10 w-[66px] lg:w-[72px]">
            {colR1.map((c) => (
              <Case key={c.id} data={c} {...caseProps(c)} />
            ))}
          </div>
          {/* Right outer — 7 cases */}
          <div className="flex flex-col gap-[7px] w-[66px] lg:w-[72px]">
            {colR2.map((c) => (
              <Case key={c.id} data={c} {...caseProps(c)} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
