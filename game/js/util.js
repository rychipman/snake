
//  Direction consts
UP = -1;
DOWN = 1;
LEFT = -2;
RIGHT = 2;

GRID_DIM = 21;
GRID_SIZE = 24;
OFFSET = 88;

function coordsToPx(x, y) {
	return {
		x: coordToPx(x),
		y: coordToPx(y),
	};
}

function coordToPx(x) {
	return x * GRID_SIZE + OFFSET;
}

function pxToCoord(x) {
	return (x - OFFSET) / GRID_SIZE;
}
