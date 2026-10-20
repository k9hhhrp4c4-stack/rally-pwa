import type { Match, Player, Round, ScoringMode, Team, Tournament, TournamentSettings } from '../types';

const uid = () => globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const pairKey = (a: string, b: string) => [a,b].sort().join('|');

export function generateAmericanoSchedule(players: Player[], settings: TournamentSettings): { rounds: Round[]; matches: Match[]; notes: string[] } {
  const active = players.filter(p => p.active);
  if (active.length < 4) throw new Error('Americano membutuhkan minimal 4 pemain aktif.');
  if (settings.courts < 1) throw new Error('Jumlah lapangan minimal 1.');
  const rounds: Round[] = [], matches: Match[] = [], partnerCounts = new Map<string, number>(), opponentCounts = new Map<string, number>();
  const notes: string[] = [];
  const roundsCount = Math.max(1, settings.rounds);
  for (let r = 1; r <= roundsCount; r++) {
    const available = [...active].sort((a,b) => {
      const sitA = rounds.slice(0, r-1).filter(rd => rd.sitOutPlayerIds.includes(a.id)).length;
      const sitB = rounds.slice(0, r-1).filter(rd => rd.sitOutPlayerIds.includes(b.id)).length;
      return sitB - sitA || Math.random() - 0.5;
    });
    const slots = Math.min(settings.courts, Math.floor(available.length / 4));
    const playingCount = slots * 4;
    if (slots === 0) throw new Error('Tidak cukup pemain aktif untuk membuat satu pertandingan.');
    const chosen = available.slice(0, playingCount);
    const sitOutPlayerIds = available.slice(playingCount).map(p => p.id);
    // Exhaustive candidate search over pairings for the round, scoring repeat partners and opponents.
    let best: { teams: [Team, Team][]; cost: number } | undefined;
    const search = (pool: Player[], acc: [Team, Team][], cost: number) => {
      if (cost >= (best?.cost ?? Infinity)) return;
      if (!pool.length) { best = { teams: acc, cost }; return; }
      const first = pool[0];
      for (let i = 1; i < pool.length; i++) for (let j = i+1; j < pool.length; j++) for (let k = j+1; k < pool.length; k++) {
        const rest = pool.filter((_,idx) => ![0,i,j,k].includes(idx));
        const quartet = [first, pool[i], pool[j], pool[k]];
        const pairings: [Team,Team][] = [
          [{playerIds:[quartet[0].id,quartet[1].id]}, {playerIds:[quartet[2].id,quartet[3].id]}],
          [{playerIds:[quartet[0].id,quartet[2].id]}, {playerIds:[quartet[1].id,quartet[3].id]}],
          [{playerIds:[quartet[0].id,quartet[3].id]}, {playerIds:[quartet[1].id,quartet[2].id]}]
        ];
        for (const pairing of pairings) {
          const [a,b] = pairing;
          const pkeys = [pairKey(...a.playerIds), pairKey(...b.playerIds)];
          const okeys = a.playerIds.flatMap(x => b.playerIds.map(y => pairKey(x,y)));
          const nextCost = cost + pkeys.reduce((s,key) => s + (partnerCounts.get(key) ?? 0) * 12, 0) + okeys.reduce((s,key) => s + (opponentCounts.get(key) ?? 0) * 3, 0);
          search(rest, [...acc, pairing], nextCost);
        }
      }
    };
    // For larger groups, allocate courts independently to keep the scheduler responsive.
    if (chosen.length <= 12) search(chosen, [], 0);
    else {
      const groups: Player[][] = [];
      for (let i=0; i<chosen.length; i+=4) groups.push(chosen.slice(i,i+4));
      const teams = groups.map(q => [{playerIds:[q[0].id,q[1].id] as [string,string]},{playerIds:[q[2].id,q[3].id] as [string,string]}] as [Team,Team]);
      best = { teams, cost: 0 }; notes.push('Untuk menjaga performa, optimasi rotasi dilakukan per lapangan pada jumlah pemain di atas 12.');
    }
    if (!best) throw new Error('Jadwal tidak dapat dibuat.');
    const matchIds: string[] = [];
    best.teams.forEach((teams, idx) => {
      const id = uid(); matchIds.push(id);
      matches.push({ id, roundNumber:r, courtNumber:idx+1, teams, score:[0,0], status:'scheduled', scoreEvents:[], scoringMode:settings.scoringMode, pointTarget:settings.pointTarget });
      for (const t of teams) { const key=pairKey(...t.playerIds); partnerCounts.set(key,(partnerCounts.get(key)??0)+1); }
      for (const x of teams[0].playerIds) for (const y of teams[1].playerIds) { const key=pairKey(x,y); opponentCounts.set(key,(opponentCounts.get(key)??0)+1); }
    });
    rounds.push({number:r, matchIds, sitOutPlayerIds, status:'pending'});
  }
  if (active.length % 4 !== 0) notes.push(`${active.length % 4} pemain tidak dapat bermain pada setiap putaran; jadwal membagi waktu istirahat secara bergilir.`);
  if (settings.courts > Math.floor(active.length/4)) notes.push(`Lapangan aktif dibatasi menjadi ${Math.floor(active.length/4)} per putaran karena jumlah pemain.`);
  return { rounds, matches, notes };
}

export function allocateAmericanoPoints(matches: Match[], players: Player[]) {
  const map = new Map(players.map(p => [p.id, {playerId:p.id, points:0, matches:0, wins:0, draws:0, losses:0, scored:0, conceded:0, differential:0, average:0}]));
  for (const m of matches.filter(x => x.status === 'completed')) {
    for (const side of [0,1] as const) for (const id of m.teams[side].playerIds) {
      const s = map.get(id); if (!s) continue;
      s.points += m.score[side]; s.matches++; s.scored += m.score[side]; s.conceded += m.score[1-side];
      if (m.score[side] > m.score[1-side]) s.wins++; else if (m.score[side] < m.score[1-side]) s.losses++; else s.draws++;
    }
  }
  return [...map.values()].map(s => ({...s, differential:s.scored-s.conceded, average:s.matches ? s.points/s.matches : 0}));
}

export function validateFixedTotalScore(score: [number, number], target: number) {
  return score.every(n => Number.isInteger(n) && n >= 0) && score[0] + score[1] === target;
}

export function rankStandings<T extends { points:number; wins:number; differential:number; scored:number }>(standings:T[], order:('points'|'wins'|'differential'|'scored')[] = ['points','wins','differential','scored']) {
  return [...standings].sort((a,b) => { for (const key of order) if (a[key] !== b[key]) return b[key]-a[key]; return 0; });
}
