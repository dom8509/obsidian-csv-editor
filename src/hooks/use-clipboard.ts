import React, { useReducer } from 'react';

export const EVENT_CLIPBOARD_ADDED = "EVENT_CLIPBOARD_ADDED";

export type ClipboardCellType = {
	column: number; // Colum index
	row: number; // Row index
};

export enum ClipboardOperationType {
	None = 0,
	Cut,
	Copy,
}

export type ClipboardType = {
	start?: ClipboardCellType;
	end?: ClipboardCellType;
	operation: ClipboardOperationType;
};

export const useClipboard = (): [ClipboardType, React.Dispatch<any>] => {
	return useReducer(clipboardReducer, {
		operation: ClipboardOperationType.None,
	});
};

const clipboardReducer = (
	prevState: ClipboardType,
	action: any
): ClipboardType => {
	switch (action.type) {
		case EVENT_CLIPBOARD_ADDED: {
			console.debug("Action EVENT_CLIPBOARD_ADDED triggered");

			return {
				...prevState,
				start: action.payload.start,
				end: action.payload.end,
				operation: action.payload.operation,
			};
		}
		default: {
			console.error("Unknown action: " + action.type);
			return prevState;
		}
	}
};
