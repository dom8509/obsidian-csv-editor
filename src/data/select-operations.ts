import {
    EVENT_SELECT_CELL_UPDATED, EVENT_SELECT_COLUMN_UPDATED, EVENT_SELECT_ROW_UPDATED
} from 'types/events';

export const selectCell = (row: number, column: number) => ({
	type: EVENT_SELECT_CELL_UPDATED,
	payload: {
		row,
		column,
	},
});

export const selectRow = (row: number, column: number) => ({
	type: EVENT_SELECT_ROW_UPDATED,
	payload: {
		row,
		column,
	},
});

export const selectColumn = (row: number, column: number) => ({
	type: EVENT_SELECT_COLUMN_UPDATED,
	payload: {
		row,
		column,
	},
});
