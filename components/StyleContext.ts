import { createContext } from 'react';

const [
	//aefwf
	other2,
	primary,
	background,
	//awef
	accent,
	color,
] = ['#104F55', '#32746D', '#9EC5AB', '#01200F', '#011502'].map((v) =>
	multiply(v, 0.4)
);

export const styles = {
	background,
	primary,
	color: multiply(invert(color), 0.8),
	accent,
	other2,
};

const StyleContext = createContext(styles);

function hexToRgb(hex: string) {
	const { r, g, b } = /#?(?<r>..)(?<g>..)(?<b>..)/.exec(hex.toLowerCase())!
		.groups!;

	return ([r, g, b] as const).map((n) => parseInt(n, 16));
}

function rgbToHex(r: number, g: number, b: number) {
	return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function multiply(color: string, amount: number) {
	const [r, g, b] = hexToRgb(color).map((v) => (v * amount) & 255);

	return rgbToHex(r, g, b);
}

function invert(color: string) {
	const [r, g, b] = hexToRgb(color).map((v) => 255 - v);

	return rgbToHex(r, g, b);
}

export default StyleContext;
