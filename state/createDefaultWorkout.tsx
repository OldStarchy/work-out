import { Workout } from './Workout';

export function createDefaultWorkout(): Workout {
	return {
		title: '',
		comments: null,
		sets: [
			{ reps: 8, comment: null },
			{ reps: 8, comment: null },
			{ reps: 8, comment: null },
		],
		date: new Date().toISOString().split('T')[0],
	};
}
