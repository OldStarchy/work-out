import { useRef, useState } from 'react';

interface SuggestBoxProps {
	options: string[];
	value: string;
	onChange: (value: string) => void;
}
/**
 * An input box that has a preset list of options, or a custom option can be typed
 */
export default function SuggestBox({
	options,
	value,
	onChange,
}: SuggestBoxProps) {
	const suggestBoxRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [showOptions, setShowOptions] = useState(false);

	const filteredOptions = options.filter((option) => option.includes(value));

	const exactMatch =
		filteredOptions.length === 1 && filteredOptions[0] === value;

	return (
		<div className="suggest-box" ref={suggestBoxRef}>
			<div style={{ display: 'flex' }}>
				<input
					type="text"
					value={value}
					ref={inputRef}
					onChange={(e) => onChange(e.target.value)}
					onFocus={() => setShowOptions(true)}
					onBlur={(e) => {
						if (
							!suggestBoxRef.current?.contains(
								e.relatedTarget as HTMLElement
							)
						) {
							setShowOptions(false);
						}
					}}
				/>
				{value && (
					<button
						onClick={() => {
							onChange('');
							inputRef.current?.focus();
						}}
					>
						x
					</button>
				)}
			</div>
			{showOptions && !exactMatch && (
				<div className="options">
					{filteredOptions.map((option) => (
						<button
							className="option"
							key={option}
							onClick={() => {
								onChange(option);
								setShowOptions(false);
							}}
						>
							{option}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
