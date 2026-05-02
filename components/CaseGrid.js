'use client';
import Case from './Case';

export default function CaseGrid({ cases, playerCaseId, phase, onSelect, onOpen }) {
  const rows = [
    cases.slice(0, 5),
    cases.slice(5, 10),
    cases.slice(10, 15),
    cases.slice(15, 20),
  ];

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center py-3">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-3/4 bg-gradient-to-b from-ice/10 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ice/[0.04] to-transparent" />
      <div className="relative flex flex-col gap-3 md:gap-4 w-full max-w-3xl">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="grid grid-cols-5 gap-3 md:gap-4"
            style={{ transform: `translateY(${ri * 0}px)` }}
          >
            {row.map((c) => (
              <Case
                key={c.id}
                data={c}
                isPlayerCase={c.id === playerCaseId}
                phase={phase}
                onSelect={onSelect}
                onOpen={onOpen}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none mt-6 h-3 w-2/3 max-w-xl rounded-full bg-black/60 blur-md" />
    </div>
  );
}
