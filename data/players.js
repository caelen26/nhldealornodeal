export const NHL_PLAYERS = [
  { name: 'Connor McDavid',    team: 'Edmonton Oilers',       score: 100, rarity: 'GOAT'      },
  { name: 'Nathan MacKinnon',  team: 'Colorado Avalanche',    score: 99,  rarity: 'Elite'     },
  { name: 'Leon Draisaitl',    team: 'Edmonton Oilers',       score: 97,  rarity: 'Elite'     },
  { name: 'Nikita Kucherov',   team: 'Tampa Bay Lightning',   score: 96,  rarity: 'Elite'     },
  { name: 'Cale Makar',        team: 'Colorado Avalanche',    score: 95,  rarity: 'Elite'     },
  { name: 'Macklin Celebrini', team: 'San Jose Sharks',       score: 94,  rarity: 'Elite'     },
  { name: 'Auston Matthews',   team: 'Toronto Maple Leafs',   score: 93,  rarity: 'Superstar' },
  { name: 'Sidney Crosby',     team: 'Pittsburgh Penguins',   score: 92,  rarity: 'Superstar' },
  { name: 'David Pastrnak',    team: 'Boston Bruins',         score: 91,  rarity: 'Superstar' },
  { name: 'Kirill Kaprizov',   team: 'Minnesota Wild',        score: 90,  rarity: 'Superstar' },
  { name: 'Quinn Hughes',      team: 'Vancouver Canucks',     score: 89,  rarity: 'Superstar' },
  { name: 'Mark Scheifele',    team: 'Winnipeg Jets',         score: 87,  rarity: 'Superstar' },
  { name: 'Nick Suzuki',       team: 'Montreal Canadiens',    score: 86,  rarity: 'Superstar' },
  { name: 'Mitch Marner',      team: 'Toronto Maple Leafs',   score: 85,  rarity: 'Solid'     },
  { name: 'Sebastian Aho',     team: 'Carolina Hurricanes',   score: 84,  rarity: 'Solid'     },
  { name: 'Brayden Point',     team: 'Tampa Bay Lightning',   score: 83,  rarity: 'Solid'     },
  { name: 'Kyle Connor',       team: 'Winnipeg Jets',         score: 81,  rarity: 'Solid'     },
  { name: 'Bo Horvat',         team: 'New York Islanders',    score: 79,  rarity: 'Solid'     },
  { name: 'Matt Barzal',       team: 'New York Islanders',    score: 78,  rarity: 'Solid'     },
  { name: 'Timo Meier',        team: 'New Jersey Devils',     score: 77,  rarity: 'Solid'     },
  { name: 'Brock Boeser',      team: 'Vancouver Canucks',     score: 75,  rarity: 'Solid'     },
  { name: 'Andrew Copp',       team: 'Detroit Red Wings',     score: 73,  rarity: 'Risk'      },
  { name: 'Evan Rodrigues',    team: 'Florida Panthers',      score: 70,  rarity: 'Risk'      },
  { name: 'Nick Paul',         team: 'Tampa Bay Lightning',   score: 66,  rarity: 'Risk'      },
  { name: 'Tristan Jarry',     team: 'Pittsburgh Penguins',   score: 62,  rarity: 'Risk'      },
  { name: 'Logan Stanley',     team: 'Winnipeg Jets',         score: 54,  rarity: 'Risk'      },
];

export function rarityAccentGradient(rarity) {
  switch (rarity) {
    case 'GOAT':      return 'from-yellow-200 via-amber-400 to-yellow-600';
    case 'Elite':     return 'from-purple-300 via-violet-500 to-blue-700';
    case 'Superstar': return 'from-sky-300 via-cyan-400 to-blue-600';
    case 'Solid':     return 'from-slate-300 via-slate-400 to-slate-600';
    default:          return 'from-red-400 via-rose-500 to-red-800';
  }
}

export function rarityCardSkin(rarity) {
  switch (rarity) {
    case 'GOAT':
      return 'bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 text-black border-yellow-200/90';
    case 'Elite':
      return 'bg-gradient-to-br from-purple-300 via-violet-500 to-blue-800 text-white border-purple-300/80';
    case 'Superstar':
      return 'bg-gradient-to-br from-sky-300 via-cyan-400 to-blue-700 text-white border-sky-300/80';
    case 'Solid':
      return 'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 text-white border-slate-300/70';
    default:
      return 'bg-gradient-to-br from-red-400 via-rose-600 to-red-900 text-white border-red-400/60';
  }
}

export function raritySideTone(rarity) {
  switch (rarity) {
    case 'GOAT':
      return 'bg-gradient-to-r from-yellow-400/30 via-amber-500/12 to-transparent border-yellow-400/55 text-yellow-100 shadow-[0_0_12px_rgba(255,215,0,0.1)]';
    case 'Elite':
      return 'bg-gradient-to-r from-purple-400/25 via-violet-500/10 to-transparent border-purple-400/45 text-purple-100';
    case 'Superstar':
      return 'bg-gradient-to-r from-sky-400/20 via-cyan-500/8 to-transparent border-sky-400/35 text-sky-50';
    case 'Solid':
      return 'bg-gradient-to-r from-slate-400/18 via-slate-500/6 to-transparent border-slate-400/30 text-slate-100';
    default:
      return 'bg-gradient-to-r from-red-500/15 to-transparent border-red-400/25 text-red-100';
  }
}

export function rarityBadgeSymbol(rarity) {
  switch (rarity) {
    case 'GOAT':      return '★';
    case 'Elite':     return '◈';
    case 'Superstar': return '◆';
    case 'Solid':     return '●';
    default:          return '▼';
  }
}

export function rarityGlow(rarity) {
  switch (rarity) {
    case 'GOAT':      return 'rgba(255,215,0,0.50)';
    case 'Elite':     return 'rgba(139,92,246,0.50)';
    case 'Superstar': return 'rgba(57,189,248,0.45)';
    case 'Solid':     return 'rgba(199,206,219,0.35)';
    default:          return 'rgba(255,77,77,0.40)';
  }
}

export function rarityRingPulse(rarity) {
  return rarity === 'GOAT' || rarity === 'Elite';
}
