import { EVENT_EDIT_CELL_STARTED, EVENT_EDIT_FINISHED } from 'types/events';

export const editCellBegin = (cellId: string) => ({
	type: EVENT_EDIT_CELL_STARTED,
	payload: {
		cellId,
	},
});

export const editFinish = () => ({
	type: EVENT_EDIT_FINISHED,
});
