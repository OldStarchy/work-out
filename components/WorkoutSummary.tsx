import { Workout } from '../state/Workout';
import Card from './layout/Card';

export default function WorkoutSummary({ workout }: { workout: Workout }) {
	return (
		<Card>
			{workout.date} - {workout.sets.length} sets
			{workout.sets.map((set, id) => (
				<div key={id}>
					{set.reps} reps
					{set.comment && <> - {set.comment}</>}
				</div>
			))}
		</Card>
	);
}
