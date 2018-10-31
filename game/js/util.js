
//  Direction consts
UP = -1;
DOWN = 1;
LEFT = -2;
RIGHT = 2;

GRID_DIM_X = 21;
GRID_DIM_Y = 21;
OFFSET_X = 88;
OFFSET_Y = 88;
GRID_SIZE = 24;

function coordsToPx(x, y) {
	return {
		x: coordToPxX(x),
		y: coordToPxY(y),
	};
}

function coordToPxX(x) {
	return x * GRID_SIZE + OFFSET_X;
}

function coordToPxY(y) {
	return y * GRID_SIZE + OFFSET_Y;
}

function pxToCoordX(x) {
	return (x - OFFSET_X) / GRID_SIZE;
}

function pxToCoordY(y) {
	return (y - OFFSET_Y) / GRID_SIZE;
}
