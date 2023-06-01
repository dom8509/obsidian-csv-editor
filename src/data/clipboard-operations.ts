import {
    ClipboardCellType, ClipboardOperationType, EVENT_CLIPBOARD_ADDED
} from 'hooks/use-clipboard';

export const clipboardAddCut = (
	start: ClipboardCellType,
	end: ClipboardCellType
) => ({
	type: EVENT_CLIPBOARD_ADDED,
	payload: {
		start: start,
		end: end,
		operation: ClipboardOperationType.Cut,
	},
});

export const clipboardAddCopy = (
	start: ClipboardCellType,
	end: ClipboardCellType
) => ({
	type: EVENT_CLIPBOARD_ADDED,
	payload: {
		start: start,
		end: end,
		operation: ClipboardOperationType.Copy,
	},
});
