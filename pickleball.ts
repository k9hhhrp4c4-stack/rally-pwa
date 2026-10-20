export interface PickleballState { score:[number,number]; servingTeam:0|1; serverNumber:1|2; firstServerTeam:0|1; finished:boolean; winner?:0|1; rallyScoring:boolean; target:number; winByTwo:boolean; }
export const newPickleballState = (target=11, rallyScoring=false, winByTwo=true):PickleballState => ({score:[0,0],servingTeam:0,serverNumber:2,firstServerTeam:0,finished:false,rallyScoring,target,winByTwo});
export function pickleballRally(state:PickleballState, winner:0|1):PickleballState {
  if(state.finished) return state;
  const s:PickleballState={...state,score:[...state.score]};
  if(s.rallyScoring || s.servingTeam===winner) s.score[winner]++;
  if(s.score[winner]>=s.target && (!s.winByTwo || s.score[winner]-s.score[1-winner]>=2)){s.finished=true;s.winner=winner;return s;}
  if(!s.rallyScoring && s.servingTeam!==winner){
    if(s.serverNumber===1) s.serverNumber=2;
    else {s.serverNumber=1;s.servingTeam=(1-s.servingTeam) as 0|1;}
  }
  return s;
}
export function pickleballServerCall(state:PickleballState){return `${state.score[0]}-${state.score[1]}-${state.serverNumber}`;}
