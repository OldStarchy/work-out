import { Excersize } from './Exdersize';
import { createDefaultSet } from './createDefaultSet';

export function createDefaultWorkout(): Excersize {
	return {
		excersize: '',
		weight: null,
		comments: null,
		sets: [createDefaultSet(), createDefaultSet(), createDefaultSet()],
		date: new Date().toISOString().split('T')[0],
	};
}
