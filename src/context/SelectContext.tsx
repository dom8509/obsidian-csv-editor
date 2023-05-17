import React, {
    createContext, Dispatch, ReactNode, useContext, useEffect, useReducer
} from 'react';
import {
    EVENT_SELECT_CELL_UPDATED, EVENT_SELECT_CLEARED, EVENT_SELECT_COLUMN_UPDATED,
    EVENT_SELECT_FINISHED, EVENT_SELECT_ROW_UPDATED
} from 'types/events';

type SelectedCellType = {
	row: number; // Row index
	column: number; // Colum index
};

type SelectedCellsType = {
	start?: SelectedCellType;
	end?: SelectedCellType;
	isSelecting: boolean;
};

interface Props {
	children: ReactNode;
}

const SelectContext = createContext<SelectedCellsType | undefined>(undefined);
const SelectDispatchContext = createContext<Dispatch<any> | undefined>(
	undefined
);

export const useSelect = () => {
	const context = useContext(SelectContext);
	if (context === undefined) {
		throw new Error(
			"useSelect() called without a <SelectProvider /> in the tree."
		);
	}
	return context;
};

export const useSelectDispatch = () => {
	const context = useContext(SelectDispatchContext);
	if (context === undefined) {
		throw new Error(
			"useSelectDispatch() called without a <SelectProvider /> in the tree."
		);
	}
	return context;
};

export default function SelectProvider({ children }: Props) {
	const [select, dispatch] = useReducer(selectReducer, {
		isSelecting: false,
	});

	const onMouseUp = () => {
		if (select.isSelecting) {
			dispatch({ type: EVENT_SELECT_FINISHED });
		}
	};

	const onPageClick = () => {
		if (select.start || select.end) {
			dispatch({ type: EVENT_SELECT_CLEARED });
		}
	};

	useEffect(() => {
		// Keep listening to mouse if user releases the mouse (dragging outside)
		document.addEventListener("mouseup", onMouseUp);
		// Listen for any outside mouse clicks
		document.addEventListener("mousedown", onPageClick);

		return () => {
			document.removeEventListener("mouseup", onMouseUp);
			document.removeEventListener("mousedown", onPageClick);
		};
	}, []);

	return (
		<SelectContext.Provider value={select}>
			<SelectDispatchContext.Provider value={dispatch}>
				{children}
			</SelectDispatchContext.Provider>
		</SelectContext.Provider>
	);
}

const selectReducer = (
	prevState: SelectedCellsType,
	action: any
): SelectedCellsType => {
	switch (action.type) {
		case EVENT_SELECT_CELL_UPDATED: {
			if (!prevState.start) {
				return {
					...prevState,
					start: {
						row: action.payload.row,
						column: action.payload.column,
					},
					isSelecting: true,
				};
			} else {
				return {
					...prevState,
					end: {
						row: action.payload.row,
						column: action.payload.column,
					},
				};
			}
		}
		case EVENT_SELECT_ROW_UPDATED: {
			if (!prevState.start) {
				return {
					...prevState,
					start: {
						row: action.payload.row,
						column: 0,
					},
					end: {
						row: action.payload.row,
						column: action.payload.column,
					},
					isSelecting: true,
				};
			} else {
				return {
					...prevState,
					end: {
						row: action.payload.row,
						column: action.payload.column,
					},
				};
			}
		}
		case EVENT_SELECT_COLUMN_UPDATED: {
			if (!prevState.start) {
				return {
					...prevState,
					start: {
						row: 0,
						column: action.payload.column,
					},
					end: {
						row: action.payload.row,
						column: action.payload.column,
					},
					isSelecting: true,
				};
			} else {
				return {
					...prevState,
					end: {
						row: action.payload.row,
						column: action.payload.column,
					},
				};
			}
		}
		case EVENT_SELECT_FINISHED: {
			return {
				...prevState,
				isSelecting: false,
			};
		}
		case EVENT_SELECT_CLEARED: {
			return {
				...prevState,
				start: undefined,
				end: undefined,
			};
		}
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
};
