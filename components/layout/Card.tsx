import { PropsWithChildren } from 'react';

export default function Card({ children }: PropsWithChildren<{}>) {
	return (
		<div
			style={{
				backgroundColor: 'white',
				borderRadius: '0.5rem',
				boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.1)',
				padding: '1rem',
			}}
		>
			{children}
		</div>
	);
}
