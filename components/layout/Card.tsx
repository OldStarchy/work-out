import { PropsWithChildren, useContext } from 'react';
import StyleContext from '../StyleContext';

export default function Card({ children }: PropsWithChildren<{}>) {
	const style = useContext(StyleContext);

	return (
		<div
			style={{
				backgroundColor: style.background,
				borderRadius: '0.25rem',
				boxShadow: `2px 2px 0.5rem 0 ${style.accent}`,
				padding: '0.5rem',
				margin: '0.5rem -0.5rem',
			}}
		>
			{children}
		</div>
	);
}
