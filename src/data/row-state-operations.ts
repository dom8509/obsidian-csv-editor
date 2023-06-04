import { EVENT_ROW_ADDED, EVENT_ROW_DELETED } from 'types/events';

export const addRow = (index: number) => ({
	type: EVENT_ROW_ADDED,
	payload: {
		index
	}
});

export const deleteRows = (start: number, end: number) => ({
	type: EVENT_ROW_DELETED,
	payload: {
		start,
		end,
	},
});
