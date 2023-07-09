import { Set } from './Set';

export interface Excersize {
	date: string; // yyyy-mm-dd
	excersize: string;
	weight: string | null;
	comments: string | null;
	sets: Set[];
}
