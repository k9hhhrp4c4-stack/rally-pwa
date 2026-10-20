import { describe,it,expect } from 'vitest';
import { allocateAmericanoPoints, generateAmericanoSchedule, validateFixedTotalScore, rankStandings } from './americano';
import type { Player, TournamentSettings, Match } from '../types';
const players:Player[]=Array.from({length:8},(_,i)=>({id:`p${i+1}`,name:`Player ${i+1}`,active:true}));
const settings:TournamentSettings={sport:'Pickleball',format:'Americano',scoringMode:'Americano points',courts:2,rounds:3,pointTarget:24,mixedDoubles:false,winByTwo:false,tieBreakOrder:['points','wins','differential','scored']};
describe('Americano engine',()=>{
 it('allocates team points to both teammates',()=>{const m:Match={id:'m1',roundNumber:1,courtNumber:1,teams:[{playerIds:['p1','p2']},{playerIds:['p3','p4']}],score:[14,10],status:'completed',scoreEvents:[],scoringMode:'Americano points',pointTarget:24};const s=allocateAmericanoPoints([m],players);expect(s.find(x=>x.playerId==='p1')?.points).toBe(14);expect(s.find(x=>x.playerId==='p2')?.points).toBe(14);expect(s.find(x=>x.playerId==='p3')?.points).toBe(10);});
 it('validates fixed total score',()=>{expect(validateFixedTotalScore([14,10],24)).toBe(true);expect(validateFixedTotalScore([15,10],24)).toBe(false);expect(validateFixedTotalScore([-1,25],24)).toBe(false);});
 it('creates court-safe multi-round schedule with unique player assignments per round',()=>{const result=generateAmericanoSchedule(players,settings);expect(result.rounds).toHaveLength(3);expect(result.matches).toHaveLength(6);for(const round of result.rounds){const ms=result.matches.filter(m=>round.matchIds.includes(m.id));expect(ms).toHaveLength(2);const ids=ms.flatMap(m=>m.teams.flatMap(t=>t.playerIds));expect(new Set(ids).size).toBe(ids.length);}});
 it('balances sit-outs for non-multiple-of-four player counts',()=>{const result=generateAmericanoSchedule(players.slice(0,6),{...settings,courts:2,rounds:3});expect(result.rounds.every(r=>r.sitOutPlayerIds.length===2)).toBe(true);const rests=result.rounds.flatMap(r=>r.sitOutPlayerIds);expect(new Set(rests).size).toBeGreaterThan(1);});
 it('ranks by configured priority',()=>{const rows=[{points:10,wins:1,differential:3,scored:22},{points:10,wins:2,differential:-1,scored:20}];expect(rankStandings(rows,['points','wins'])[0].wins).toBe(2);});
});
