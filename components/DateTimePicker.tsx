function today() {
	return new Date().toISOString().split('T')[0];
}
/**
 * Datetime picker with "today" button and shows time in increments of 15 minutes
 */
export default function DateTimePicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div
			style={{
				display: 'flex',
			}}
		>
			<button
				disabled={value === today()}
				onClick={() => onChange(today())}
			>
				Today
			</button>

			<input
				type="date"
				value={value}
				onChange={(e) => onChange(e.target.value ?? today())}
			/>
		</div>
	);
}
