import { PropsWithChildren, useContext } from 'react';
import StyleContext from './StyleContext';

export default function Layout({
	pageTitle,
	children,
}: PropsWithChildren<{ pageTitle: string }>) {
	const style = useContext(StyleContext);

	return (
		<div
			style={{
				display: 'flex',
				width: '100%',
				height: '100%',
				flexDirection: 'column',
				margin: '0',
				padding: '0',
			}}
		>
			<header
				style={{
					flexGrow: 0,
					display: 'flex',
					padding: '1rem 1rem',
					alignItems: 'center',
					backgroundColor: style.primary,
				}}
			>
				<h1
					style={{
						textTransform: 'uppercase',
						flexGrow: 1,
						textAlign: 'center',
					}}
				>
					{pageTitle}
				</h1>
				<span
					style={{
						textTransform: 'uppercase',
						fontSize: '0.75em',
					}}
				>
					Work Out
				</span>
			</header>
			<main
				style={{
					flexGrow: 1,
					flexShrink: 1,
					overflow: 'auto',
					padding: '1rem',
				}}
			>
				{children}
			</main>
			<footer
				style={{
					flexGrow: 0,
					padding: '1rem',
					textAlign: 'right',
				}}
			>
				&copy; {new Date().getFullYear()}{' '}
				<a href="https://github.com/OldStarchy" target="_BLANK">
					OldStarchy
				</a>
			</footer>
		</div>
	);
}
