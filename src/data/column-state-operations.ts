import { EVENT_COLUMN_ADDED, EVENT_COLUMN_DELETED } from 'types/events';

export const addColumn = (index: number) => ({
	type: EVENT_COLUMN_ADDED,
	payload: {
		index,
	},
});

export const deleteColumns = (start: number, end: number) => ({
	type: EVENT_COLUMN_DELETED,
	payload: {
		start,
		end,
	},
});