import { useOutsideClick } from 'hooks/use-outside-click';
import React, {
    createContext, Dispatch, ReactNode, useContext, useEffect, useReducer
} from 'react';
import {
    EVENT_SELECT_CELL_STARTED, EVENT_SELECT_CELL_UPDATED, EVENT_SELECT_CLEARED,
    EVENT_SELECT_COLUMN_STARTED, EVENT_SELECT_COLUMN_UPDATED, EVENT_SELECT_FINISHED,
    EVENT_SELECT_ROW_STARTED, EVENT_SELECT_ROW_UPDATED
} from 'types/events';

type SelectedCellType = {
	column: number; // Colum index
	row: number; // Row index
};

export type SelectedCellsType = {
	start?: SelectedCellType;
	end?: SelectedCellType;
	isSelectingCells: boolean;
	isSelectingColumns: boolean;
	isSelectingRows: boolean;
};

interface Props {
	children: ReactNode;
}

const SelectableContext = createContext<SelectedCellsType | undefined>(
	undefined
);
const SelectableDispatchContext = createContext<Dispatch<any> | undefined>(
	undefined
);

export const useSelectable = () => {
	const context = useContext(SelectableContext);
	if (context === undefined) {
		throw new Error(
			"useSelectable() called without a <SelectableProvider /> in the tree."
		);
	}

	return context;
};

export const useSelectableDispatch = () => {
	const context = useContext(SelectableDispatchContext);
	if (context === undefined) {
		throw new Error(
			"useSelectableDispatch() called without a <SelectableProvider /> in the tree."
		);
	}
	return context;
};

export default function SelectableProvider({ children }: Props) {
	const [select, dispatch] = useReducer(selectReducer, {
		isSelectingCells: false,
		isSelectingColumns: false,
		isSelectingRows: false,
	});
	const isSelecting = () => {
		return (
			select.isSelectingCells ||
			select.isSelectingColumns ||
			select.isSelectingRows
		);
	};

	const isSelected = () => {
		return select.start || select.end;
	};

	const handleOutSideClick = () => {
		console.log("handleOutSideClick");
		if (isSelected()) {
			dispatch({ type: EVENT_SELECT_CLEARED });
		}
	};

	const containerRef = useOutsideClick<HTMLSpanElement>(handleOutSideClick, [
		handleOutSideClick,
	]);

	useEffect(() => {
		const handleMouseUp = () => {
			if (
				select.isSelectingCells ||
				select.isSelectingColumns ||
				select.isSelectingRows
			) {
				dispatch({ type: EVENT_SELECT_FINISHED });
			}
		};

		if (isSelecting()) {
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [select, containerRef]);

	return (
		<SelectableContext.Provider value={select}>
			<SelectableDispatchContext.Provider value={dispatch}>
				<span className="select-container" ref={containerRef}>
					{children}
				</span>
			</SelectableDispatchContext.Provider>
		</SelectableContext.Provider>
	);
}

const selectReducer = (
	prevState: SelectedCellsType,
	action: any
): SelectedCellsType => {
	switch (action.type) {
		case EVENT_SELECT_CELL_STARTED: {
			console.debug("Action EVENT_SELECT_CELL_STARTED triggered");

			return {
				...prevState,
				start: {
					column: action.payload.column,
					row: action.payload.row,
				},
				end: {
					column: action.payload.column,
					row: action.payload.row,
				},
				isSelectingCells: true,
			};
		}
		case EVENT_SELECT_CELL_UPDATED: {
			console.debug("Action EVENT_SELECT_CELL_UPDATED triggered");

			if (!prevState.isSelectingCells) {
				throw "Missing EVENT_SELECT_CELL_STARTED event";
			} else {
				return {
					...prevState,
					end: {
						column: action.payload.column,
						row: action.payload.row,
					},
				};
			}
		}
		case EVENT_SELECT_ROW_STARTED: {
			console.debug("Action EVENT_SELECT_ROW_STARTED triggered");

			return {
				...prevState,
				start: {
					row: action.payload.row,
					column: 0,
				},
				end: {
					column: action.payload.column,
					row: action.payload.row,
				},
				isSelectingRows: true,
			};
		}
		case EVENT_SELECT_ROW_UPDATED: {
			console.debug("Action EVENT_SELECT_ROW_UPDATED triggered");

			if (!prevState.isSelectingRows) {
				throw "Missing EVENT_SELECT_ROW_STARTED event";
			} else {
				return {
					...prevState,
					end: {
						column: action.payload.column,
						row: action.payload.row,
					},
				};
			}
		}
		case EVENT_SELECT_COLUMN_STARTED: {
			console.debug("Action EVENT_SELECT_COLUMN_STARTED triggered");

			return {
				...prevState,
				start: {
					row: 0,
					column: action.payload.column,
				},
				end: {
					column: action.payload.column,
					row: action.payload.row,
				},
				isSelectingColumns: true,
			};
		}
		case EVENT_SELECT_COLUMN_UPDATED: {
			console.debug("Action EVENT_SELECT_COLUMN_UPDATED triggered");

			if (!prevState.isSelectingColumns) {
				throw "Missing EVENT_SELECT_COLUMN_STARTED event";
			} else {
				return {
					...prevState,
					end: {
						column: action.payload.column,
						row: action.payload.row,
					},
				};
			}
		}
		case EVENT_SELECT_FINISHED: {
			console.debug("Action EVENT_SELECT_FINISHED triggered");

			return {
				...prevState,
				isSelectingCells: false,
				isSelectingColumns: false,
				isSelectingRows: false,
			};
		}
		case EVENT_SELECT_CLEARED: {
			console.debug("Action EVENT_SELECT_CLEARED triggered");

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
