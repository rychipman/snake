
//  Direction consts
UP = -1;
DOWN = 1;
LEFT = -2;
RIGHT = 2;

GRID_DIM_X = 25;
GRID_DIM_Y = 24;
OFFSET_X = 96;
OFFSET_Y = 86;
GRID_SIZE = 20;

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
