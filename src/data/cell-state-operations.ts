import { EVENT_BODY_CELL_CLEARED, EVENT_BODY_CELL_UPDATED } from 'types/events';

export const updateHeaderCell = (id: string, column: number, value: any) => ({
	type: EVENT_BODY_CELL_UPDATED,
	payload: {
		cellId: id,
		columnIndex: column,
		value: value,
	},
});

export const clearHeaderCell = (id: string, column: number, value: any) => ({
	type: EVENT_BODY_CELL_CLEARED,
	payload: {
		cellId: id,
		columnIndex: column,
	},
});

export const updateBodyCell = (
	id: string,
	column: number,
	row: number,
	value: any
) => ({
	type: EVENT_BODY_CELL_UPDATED,
	payload: {
		cellId: id,
		columnIndex: column,
		rowIndex: row,
		value: value,
	},
});

export const clearBodyCell = (id: string, column: number, row: number) => ({
	type: EVENT_BODY_CELL_CLEARED,
	payload: {
		cellId: id,
		columnIndex: column,
		rowIndex: row,
	},
});
