
var dpr = window.devicePixelRatio;
var logicalHeight = window.innerHeight;
var logicalWidth = window.innerWidth;
var pxHeight = logicalHeight * dpr;
var pxWidth = logicalWidth * dpr;

console.log('dpr: ' + dpr);
console.log('logicalHeight: ' + logicalHeight);
console.log('logicalWidth: ' + logicalWidth);
console.log('pxHeight: ' + pxHeight);
console.log('pxWidth: ' + pxWidth);

function fracToPxX(frac) {
	return frac * logicalWidth;
}

function fracToPxY(frac) {
	return frac * logicalHeight;
}

var gridSquareSize = 20;

var gridWidth = Math.floor(logicalWidth / gridSquareSize);
var gridWidthPx = gridWidth * gridSquareSize;
var gridOffsetX = (logicalWidth - gridWidthPx) / 2;

var gridHeight = Math.floor(logicalHeight / gridSquareSize);
var gridHeightPx = gridHeight * gridSquareSize;
var gridOffsetY = (logicalHeight - gridHeightPx) / 2;

var GRID_DIM_X = gridWidth;
var GRID_DIM_Y = gridHeight;
var OFFSET_X = gridOffsetX;
var OFFSET_Y = gridOffsetY;
var GRID_SIZE = gridSquareSize;

function coordsToPx(x, y) {
	return {
		x: coordToPxX(x),
		y: coordToPxY(y)
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
