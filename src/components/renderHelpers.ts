import { CellShapeType } from './CellShape';

type FunctionType = (...args: any[]) => any;

export function renderValue(
	cell: CellShapeType,
	row: number,
	col: number,
	valueRenderer: FunctionType
) {
	const value = valueRenderer(cell, row, col);
	return value === null || typeof value === "undefined" ? "" : value;
}

export function renderData(
	cell: CellShapeType,
	row: number,
	col: number,
	valueRenderer: FunctionType,
	dataRenderer: FunctionType
) {
	const value = dataRenderer ? dataRenderer(cell, row, col) : null;
	return value === null || typeof value === "undefined"
		? renderValue(cell, row, col, valueRenderer)
		: value;
}
