import {
    EVENT_SELECT_CELL_STARTED, EVENT_SELECT_CELL_UPDATED, EVENT_SELECT_CLEARED,
    EVENT_SELECT_COLUMN_STARTED, EVENT_SELECT_COLUMN_UPDATED, EVENT_SELECT_FINISHED,
    EVENT_SELECT_ROW_STARTED, EVENT_SELECT_ROW_UPDATED
} from 'types/events';

export const selectCellBegin = (row: number, column: number) => ({
	type: EVENT_SELECT_CELL_STARTED,
	payload: {
		row,
		column,
	},
});

export const selectCellAdd = (row: number, column: number) => ({
	type: EVENT_SELECT_CELL_UPDATED,
	payload: {
		row,
		column,
	},
});

export const selectRowBegin = (row: number, column: number) => ({
	type: EVENT_SELECT_ROW_STARTED,
	payload: {
		row,
		column,
	},
});

export const selectRowAdd = (row: number, column: number) => ({
	type: EVENT_SELECT_ROW_UPDATED,
	payload: {
		row,
		column,
	},
});

export const selectColumnBegin = (row: number, column: number) => ({
	type: EVENT_SELECT_COLUMN_STARTED,
	payload: {
		row,
		column,
	},
});

export const selectColumnAdd = (row: number, column: number) => ({
	type: EVENT_SELECT_COLUMN_UPDATED,
	payload: {
		row,
		column,
	},
});

export const selectFinish = () => ({
	type: EVENT_SELECT_FINISHED,
});

export const selectClear = () => ({
	type: EVENT_SELECT_CLEARED,
});