import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<{}>) {
	return (
		<div
			style={{
				display: 'flex',
				width: '100vw',
				height: '100vh',
				flexDirection: 'column',
				margin: '0',
				padding: '0',
			}}
		>
			<header
				style={{
					flexGrow: 0,
				}}
			>
				Header
			</header>
			<main
				style={{
					flexGrow: 1,
					overflow: 'auto',
				}}
			>
				{children}
			</main>
			<footer style={{ flexGrow: 0 }}>Footer</footer>
		</div>
	);
}
