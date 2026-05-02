// Tier 1 — Jackpot (100)
// Tier 2 — Elite   (92–99)
// Tier 3 — High    (85–91)
// Tier 4 — Mid     (75–84)
// Tier 5 — Low     (50–74)

export const NHL_PLAYERS = [
  // Tier 1 — Jackpot
  { name: 'Connor McDavid',    team: 'Edmonton Oilers',       score: 100 },
  // Tier 2 — Elite
  { name: 'Nathan MacKinnon',  team: 'Colorado Avalanche',    score: 97  },
  { name: 'Auston Matthews',   team: 'Toronto Maple Leafs',   score: 96  },
  { name: 'Cale Makar',        team: 'Colorado Avalanche',    score: 94  },
  // Tier 3 — High
  { name: 'Leon Draisaitl',    team: 'Edmonton Oilers',       score: 91  },
  { name: 'Nikita Kucherov',   team: 'Tampa Bay Lightning',   score: 90  },
  { name: 'Artemi Panarin',    team: 'New York Rangers',      score: 88  },
  { name: 'David Pastrnak',    team: 'Boston Bruins',         score: 87  },
  { name: 'Jack Hughes',       team: 'New Jersey Devils',     score: 86  },
  // Tier 4 — Mid
  { name: 'Brayden Point',     team: 'Tampa Bay Lightning',   score: 84  },
  { name: 'Mark Stone',        team: 'Vegas Golden Knights',  score: 83  },
  { name: 'Sebastian Aho',     team: 'Carolina Hurricanes',   score: 82  },
  { name: 'Mitch Marner',      team: 'Toronto Maple Leafs',   score: 81  },
  { name: 'Bo Horvat',         team: 'New York Islanders',    score: 79  },
  { name: 'Matt Barzal',       team: 'New York Islanders',    score: 78  },
  // Tier 5 — Low
  { name: 'Andrew Copp',       team: 'Detroit Red Wings',     score: 74  },
  { name: 'Evan Rodrigues',    team: 'Pittsburgh Penguins',   score: 72  },
  { name: 'Nick Paul',         team: 'Tampa Bay Lightning',   score: 68  },
  { name: 'Miles Wood',        team: 'New Jersey Devils',     score: 60  },
  { name: 'Ryan Reaves',       team: 'New York Rangers',      score: 52  },
];

export function tierColor(score) {
  if (score >= 100) return 'jackpot';
  if (score >= 92)  return 'elite';
  if (score >= 85)  return 'high';
  if (score >= 75)  return 'mid';
  return 'low';
}

export function tierLabel(score) {
  if (score >= 100) return 'Jackpot';
  if (score >= 92)  return 'Elite';
  if (score >= 85)  return 'High';
  if (score >= 75)  return 'Mid';
  return 'Low Tier';
}

export function tierAccentGradient(tier) {
  switch (tier) {
    case 'jackpot': return 'from-amber-200 via-yellow-400 to-amber-600';
    case 'elite':   return 'from-orange-300 via-amber-500 to-orange-700';
    case 'high':    return 'from-sky-300 via-blue-500 to-blue-800';
    case 'mid':     return 'from-emerald-300 via-teal-500 to-emerald-700';
    default:        return 'from-red-400 via-rose-600 to-red-800';
  }
}

export function tierCardSkin(tier) {
  switch (tier) {
    case 'jackpot':
      return 'bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 text-black border-yellow-200/90';
    case 'elite':
      return 'bg-gradient-to-br from-orange-200 via-amber-400 to-orange-700 text-black border-orange-300/80';
    case 'high':
      return 'bg-gradient-to-br from-sky-300 via-blue-500 to-blue-800 text-white border-sky-300/80';
    case 'mid':
      return 'bg-gradient-to-br from-emerald-300 via-teal-500 to-emerald-800 text-white border-emerald-300/70';
    default:
      return 'bg-gradient-to-br from-red-400 via-rose-600 to-red-900 text-white border-red-400/60';
  }
}

export function tierSideTone(tier) {
  switch (tier) {
    case 'jackpot':
      return 'bg-gradient-to-r from-yellow-400/30 via-amber-500/12 to-transparent border-yellow-400/55 text-yellow-100 shadow-[0_0_12px_rgba(255,215,0,0.1)]';
    case 'elite':
      return 'bg-gradient-to-r from-orange-400/25 via-amber-400/10 to-transparent border-orange-400/45 text-orange-100';
    case 'high':
      return 'bg-gradient-to-r from-sky-500/20 via-blue-500/8 to-transparent border-sky-400/35 text-sky-50';
    case 'mid':
      return 'bg-gradient-to-r from-emerald-500/18 via-teal-500/6 to-transparent border-emerald-400/30 text-emerald-50';
    default:
      return 'bg-gradient-to-r from-red-500/15 to-transparent border-red-400/25 text-red-100';
  }
}

export function tierBadgeSymbol(tier) {
  switch (tier) {
    case 'jackpot': return '★';
    case 'elite':   return '◈';
    case 'high':    return '◆';
    case 'mid':     return '●';
    default:        return '·';
  }
}
