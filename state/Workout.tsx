import { Set } from './Set';

export interface Workout {
	date: string; // yyyy-mm-dd
	title: string;
	comments: string | null;
	sets: Set[];
}
