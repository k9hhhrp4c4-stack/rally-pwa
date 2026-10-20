export type TennisPoint = 0 | 1 | 2 | 3 | 4;
export interface TennisGameState { points:[number,number]; games:[number,number]; sets:[number,number]; tieBreak:boolean; finished:boolean; winner?:0|1; }
export const newTennisState = ():TennisGameState => ({points:[0,0],games:[0,0],sets:[0,0],tieBreak:false,finished:false});
export function tennisPointLabel(n:number){ return ['0','15','30','40','AD'][Math.min(4,n)] ?? '0'; }
export function addTennisPoint(state:TennisGameState, side:0|1, gamesPerSet=6, tieBreakAt=6):TennisGameState {
  if(state.finished) return state;
  const s: TennisGameState = {...state,points:[...state.points],games:[...state.games],sets:[...state.sets]};
  if(s.tieBreak){ s.points[side]++; if((s.points[side]>=7 && s.points[side]-s.points[1-side]>=2)){ s.sets[side]++; s.points=[0,0]; s.games=[0,0]; s.tieBreak=false; if(s.sets[side]>=2) {s.finished=true;s.winner=side;} } return s; }
  const a=s.points[side], b=s.points[1-side];
  if(a>=3 && b>=3){ if(a===b) s.points[side]=4; else if(a===4) { s.games[side]++; s.points=[0,0]; } else s.points=[3,3]; }
  else if(a>=3){s.games[side]++;s.points=[0,0];}
  else s.points[side]++;
  if(s.games[side]>=gamesPerSet && s.games[side]-s.games[1-side]>=2){s.sets[side]++;s.games=[0,0];if(s.sets[side]>=2){s.finished=true;s.winner=side;}}
  else if(s.games[0]===tieBreakAt && s.games[1]===tieBreakAt){s.tieBreak=true;s.points=[0,0];}
  return s;
}
