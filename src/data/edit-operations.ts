import { EVENT_EDIT_CELL_FINISHED, EVENT_EDIT_CELL_STARTED } from 'types/events';

export const editCellStart = (cellId: string) => ({
	type: EVENT_EDIT_CELL_STARTED,
	payload: {
		cellId,
	},
});

export const editCellFinish = () => ({
	type: EVENT_EDIT_CELL_FINISHED,
});