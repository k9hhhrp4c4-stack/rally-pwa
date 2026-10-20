import { describe,it,expect } from 'vitest';
import { addTennisPoint, newTennisState } from './tennis';
import { newPickleballState, pickleballRally, pickleballServerCall } from './pickleball';
describe('Tennis scoring',()=>{
 it('awards a game after four points when there is no deuce',()=>{let s=newTennisState();s=addTennisPoint(s,0);s=addTennisPoint(s,0);s=addTennisPoint(s,0);s=addTennisPoint(s,0);expect(s.games[0]).toBe(1);expect(s.points).toEqual([0,0]);});
 it('handles deuce and advantage',()=>{let s=newTennisState();for(let i=0;i<3;i++){s=addTennisPoint(s,0);s=addTennisPoint(s,1)}s=addTennisPoint(s,0);expect(s.points).toEqual([4,3]);s=addTennisPoint(s,0);expect(s.games[0]).toBe(1);});
 it('enters a tie-break at six games all',()=>{let s=newTennisState();s={...s,games:[6,6]};s=addTennisPoint(s,0);expect(s.tieBreak).toBe(true);});
});
describe('Pickleball scoring',()=>{
 it('traditional side-out awards points only to serving team',()=>{let s=newPickleballState(11,false,true);s=pickleballRally(s,1);expect(s.score).toEqual([0,0]);expect(s.servingTeam).toBe(0);expect(s.serverNumber).toBe(1);s=pickleballRally(s,0);expect(s.score).toEqual([1,0]);});
 it('rally scoring awards every rally to winner',()=>{let s=newPickleballState(11,true,false);s=pickleballRally(s,1);expect(s.score).toEqual([0,1]);});
 it('enforces win by two when enabled',()=>{let s={...newPickleballState(11,true,true),score:[10,10] as [number,number]};s=pickleballRally(s,0);expect(s.finished).toBe(false);s=pickleballRally(s,0);expect(s.finished).toBe(true);expect(s.winner).toBe(0);});
 it('formats a server call',()=>expect(pickleballServerCall(newPickleballState())).toBe('0-0-2'));
});
