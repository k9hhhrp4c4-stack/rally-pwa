import Dexie, { type Table } from 'dexie';
import type { Tournament } from '../types';
class RallyDatabase extends Dexie {
  tournaments!: Table<Tournament, string>;
  constructor(){ super('rally-local-db'); this.version(1).stores({tournaments:'id, status, updatedAt, name'}); }
}
export const db = new RallyDatabase();
export const saveTournament = async (t:Tournament) => db.tournaments.put({...t, updatedAt:Date.now()});
export const getTournaments = async () => (await db.tournaments.toArray()).sort((a,b)=>b.updatedAt-a.updatedAt);
export const getTournament = (id:string) => db.tournaments.get(id);
export const deleteTournament = (id:string) => db.tournaments.delete(id);
