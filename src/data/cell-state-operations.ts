import {
    EVENT_BODY_CELL_CLEARED, EVENT_BODY_CELL_UPDATED, EVENT_HEADER_CELL_CLEARED,
    EVENT_HEADER_CELL_UPDATED
} from 'types/events';

export const updateHeaderCellValue = (id: string, column: number, value: any) => ({
	type: EVENT_HEADER_CELL_UPDATED,
	payload: {
		cellId: id,
		columnIndex: column,
		key: "markdown",
		value: value,
	},
});

export const clearHeaderCell = (id: string, column: number, value: any) => ({
	type: EVENT_HEADER_CELL_CLEARED,
	payload: {
		cellId: id,
		columnIndex: column,
	},
});

export const updateBodyCellValue = (
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
		key: "markdown",
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
