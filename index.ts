export type Sport = 'Tennis' | 'Padel' | 'Pickleball';
export type Format = 'Americano' | 'Mexicano' | 'Fixed Teams';
export type ScoringMode = 'Americano points' | 'Conventional' | 'Rally scoring' | 'Side-out scoring';
export type TournamentStatus = 'draft' | 'active' | 'completed';
export interface Player { id: string; name: string; skill?: number; active: boolean; }
export interface Team { playerIds: [string, string]; }
export interface ScoreEvent { id: string; at: number; team: 0 | 1; before: [number, number]; after: [number, number]; }
export interface Match {
  id: string; roundNumber: number; courtNumber: number; teams: [Team, Team]; score: [number, number]; status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  scoreEvents: ScoreEvent[]; scoringMode: ScoringMode; pointTarget: number; winner?: 0 | 1 | 'draw'; completedAt?: number;
}
export interface Round { number: number; matchIds: string[]; sitOutPlayerIds: string[]; status: 'pending' | 'active' | 'completed'; }
export interface Standing { playerId: string; points: number; matches: number; wins: number; draws: number; losses: number; scored: number; conceded: number; differential: number; average: number; }
export interface TournamentSettings { sport: Sport; format: Format; scoringMode: ScoringMode; courts: number; rounds: number; pointTarget: number; mixedDoubles: boolean; winByTwo: boolean; tieBreakOrder: ('points'|'wins'|'differential'|'scored')[]; }
export interface Tournament { id: string; name: string; createdAt: number; updatedAt: number; status: TournamentStatus; players: Player[]; settings: TournamentSettings; rounds: Round[]; matches: Match[]; scheduleNotes?: string[]; }
