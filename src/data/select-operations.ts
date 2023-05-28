import {
    EVENT_SELECT_CELL_STARTED, EVENT_SELECT_CELL_UPDATED, EVENT_SELECT_CLEARED,
    EVENT_SELECT_COLUMN_STARTED, EVENT_SELECT_COLUMN_UPDATED, EVENT_SELECT_FINISHED,
    EVENT_SELECT_ROW_STARTED, EVENT_SELECT_ROW_UPDATED
} from 'types/events';

export const selectCellBegin = (column: number, row: number) => ({
	type: EVENT_SELECT_CELL_STARTED,
	payload: {
		column,
		row,
	},
});

export const selectCellAdd = (column: number, row: number) => ({
	type: EVENT_SELECT_CELL_UPDATED,
	payload: {
		column,
		row,
	},
});

export const selectRowBegin = (column: number, row: number) => ({
	type: EVENT_SELECT_ROW_STARTED,
	payload: {
		column,
		row,
	},
});

export const selectRowAdd = (column: number, row: number) => ({
	type: EVENT_SELECT_ROW_UPDATED,
	payload: {
		column,
		row,
	},
});

export const selectColumnBegin = (column: number, row: number) => ({
	type: EVENT_SELECT_COLUMN_STARTED,
	payload: {
		column,
		row,
	},
});

export const selectColumnAdd = (column: number, row: number) => ({
	type: EVENT_SELECT_COLUMN_UPDATED,
	payload: {
		column,
		row,
	},
});

export const selectFinish = () => ({
	type: EVENT_SELECT_FINISHED,
});

export const selectClear = () => ({
	type: EVENT_SELECT_CLEARED,
});
