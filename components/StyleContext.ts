import { createContext } from 'react';

const [
	//aefwf
	other2,
	primary,
	background,
	//awef
	accent,
	color,
] = ['#104F55', '#32746D', '#9EC5AB', '#01200F', '#011502'];
export const styles = {
	background,
	primary,
	color,
	accent,
	other2,
};

const StyleContext = createContext(styles);

export default StyleContext;
