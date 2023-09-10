interface User {
	id: string;
	name: string;

	credentials: UserCredential[];
}

interface BaseUserCredential {
	for: User['id'];
	type: string;
}

type UserCredential = UserCredentialPassword | UserCredentialToken;

interface UserCredentialPassword extends BaseUserCredential {
	type: 'password';
	password: string;
}

interface UserCredentialToken extends BaseUserCredential {
	type: 'token';
	token: string;
}

interface Gym {
	id: string;
	name: string;
	photos: Image[];
}

type Image = string;

/**
 * One planned visit to the gym
 */
interface RoutineTemplate {
	id: string;
	name: string;

	activities: ActivityTemplate[];
}

/**
 * One planned excersize
 */
interface ActivityTemplate {
	id: string;
	excersize: (Excersize | AdHocExcersize)[];
	sets: ActivitySetTemplate[];
	comments: string;
}

type ActivitySetTemplate = Omit<ActivitySet, 'done'>;

/**
 * A recorded visit to the gym
 */
interface Routine {
	id: string;
	name: string;
	notes?: string;

	personalAttributes: PersonalAttributes;

	activities: Activity[];

	/**
	 * "workout with friends"
	 */
	linkedRoutines: Routine['id'][];
}

interface PersonalAttributes {
	heightCm?: number;
	weightKg?: number;
	otherAttributes?: Record<string, string>;
}

interface Schedule {
	id: string;
	name: string;
	notes?: string;
	startDate: Date;
	endDate: Date;
	recurrance: number;
	recurrenceUnit: 'day' | 'week' | 'month' | 'year';
}

/**
 * Performance of one excersize
 */
interface Activity {
	id: string;
	excersize: (Excersize | AdHocExcersize)[];
	sets: ActivitySet[];
	comments: string;

	/**
	 * "workout with friends"
	 */
	linkedActivities: Activity['id'][];
}

interface ActivitySet {
	intensity: number;
	reps: number;
	max: boolean;
	assist: number;
	comments: string;
	done: boolean;

	/** Referrs to activity excersize[index], used for supersets */
	excersizeIndex: number;
}

/**
 * A pre-defined excersize
 */
interface Excersize {
	id: string;
	name: string;
	muscleGroups?: string[];
	intensityUnits: 'weight';

	instructions?: RichContent;
}

interface RichContent {}

/**
 * A one-off excersize, or one that is not yet pre-defined
 */
interface AdHocExcersize {
	name: String;
	muscleGroups?: string[];
	intensityUnits: 'weight';
}
