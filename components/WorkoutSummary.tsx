import { Workout } from '../state/Workout';
import Card from './layout/Card';

export default function WorkoutSummary({ workout }: { workout: Workout }) {
	return (
		<Card>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>{workout.title}</div>{' '}
				<div>
					{workout.date} - {workout.sets.length} sets
				</div>
			</div>
			{workout.sets.map((set, id) => (
				<div key={id}>
					{set.reps} reps
					{set.comment && <> - {set.comment}</>}
				</div>
			))}
		</Card>
	);
}
