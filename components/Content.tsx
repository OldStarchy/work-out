import { PropsWithChildren } from 'react';

export default function Content({ children }: PropsWithChildren<{}>) {
	return (
		<div
			style={{
				maxWidth: '800px',
				margin: '0 auto',
			}}
		>
			{children}
		</div>
	);
}
