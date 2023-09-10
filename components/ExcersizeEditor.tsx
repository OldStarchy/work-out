import { Updater } from 'use-immer';
import { Excersize } from '../state/Exdersize';
import { createDefaultSet } from '../state/createDefaultSet';
import DateTimePicker from './DateTimePicker';
import SuggestBox from './SuggestBox';

interface ExcersizeEditorProps {
	value: Excersize;
	onChange: Updater<Excersize>;
}
export default function ExcersizeEditor({
	value: value,
	onChange: onChange,
}: ExcersizeEditorProps) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
			}}
		>
			<h2>Record a new excersize</h2>

			<SuggestBox
				value={value.excersize}
				options={[
					'bench press',
					'overhead press',
					'barbell row',
					'pull up',
					'chin up',
					'push up',
					'curl',
					'hammer curl',
					'lat raise',
				]}
				onChange={(value) =>
					onChange((draft) => {
						if (!draft) return;
						draft.excersize = value;
					})
				}
			/>
			<DateTimePicker
				value={value.date}
				onChange={(value) => {
					onChange((draft) => {
						if (!draft) return;
						draft.date = value;
					});
				}}
			/>
			<ol>
				{value.sets.map((set, id) => (
					<li>
						<div
							style={{
								display: 'flex',
								gap: '0.5em',
								alignItems: 'center',
							}}
						>
							<h4>Set #{id + 1}</h4>
							<input
								type="number"
								value={set.reps}
								style={{
									width: '3em',
								}}
								onChange={(e) => {
									onChange((draft) => {
										if (!draft) return;
										draft.sets[id].reps =
											e.target.valueAsNumber;
									});
								}}
							/>
							<label>Reps</label>
							<input
								type="string"
								placeholder="notes..."
								value={set.comment ?? ''}
								onChange={(e) => {
									onChange((draft) => {
										if (!draft) return;
										draft.sets[id].comment =
											e.target.value || null;
									});
								}}
							/>
							<button
								type="button"
								onClick={() => {
									onChange((draft) => {
										if (!draft) return;
										draft.sets.splice(id, 1);
									});
								}}
							>
								Delete
							</button>
						</div>
					</li>
				))}
				<li>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
						}}
					>
						<button
							onClick={() =>
								onChange((draft) => {
									if (!draft) return;
									draft.sets.push(createDefaultSet());
								})
							}
						>
							add set
						</button>
					</div>
				</li>
			</ol>

			<div>
				<textarea
					placeholder="notes..."
					style={{
						backgroundColor: 'white',
						width: '100%',
						resize: 'vertical',
					}}
					value={value.comments ?? ''}
					onChange={(e) => {
						onChange((draft) => {
							if (!draft) return;
							draft.comments = e.target.value || null;
						});
					}}
				/>
			</div>
		</div>
	);
}
