import { Excersize } from '../state/Exdersize';
import Card from './layout/Card';

export default function WorkoutSummary({ workout }: { workout: Excersize }) {
	return (
		<Card>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>{workout.excersize}</div>{' '}
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
