import React, {
    createContext, Dispatch, ReactNode, useContext, useEffect, useReducer, useRef
} from 'react';
import {
    EVENT_SELECT_CELL_STARTED, EVENT_SELECT_CELL_UPDATED, EVENT_SELECT_CLEARED,
    EVENT_SELECT_COLUMN_STARTED, EVENT_SELECT_COLUMN_UPDATED, EVENT_SELECT_FINISHED,
    EVENT_SELECT_ROW_STARTED, EVENT_SELECT_ROW_UPDATED
} from 'types/events';

type SelectedCellType = {
	row: number; // Row index
	column: number; // Colum index
};

export type SelectedCellsType = {
	start?: SelectedCellType;
	end?: SelectedCellType;
	isSelectingCells: boolean;
	isSelectingRows: boolean;
	isSelectingColumns: boolean;
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
		isSelectingRows: false,
		isSelectingColumns: false,
	});
	const dgDom = useRef<HTMLSpanElement>(null);

	const isSelecting = () => {
		return (
			select.isSelectingCells ||
			select.isSelectingRows ||
			select.isSelectingColumns
		);
	};

	const isSelected = () => {
		return select.start || select.end;
	};

	useEffect(() => {
		const handlePageClick = (e: MouseEvent) => {
			if (!dgDom.current || !dgDom.current.contains(e.target as Node)) {
				console.debug("clicked outside of sheed");

				if (select.start || select.end) {
					dispatch({ type: EVENT_SELECT_CLEARED });
				}
				console.debug("removing click event");
				document.removeEventListener("click", handlePageClick);
			} else {
				console.debug("clicked sheet cell");
			}
		};

		const handleMouseUp = () => {
			if (
				select.isSelectingCells ||
				select.isSelectingRows ||
				select.isSelectingColumns
			) {
				dispatch({ type: EVENT_SELECT_FINISHED });
			}
		};

		// Keep listening to mouse if user releases the mouse (dragging outside)
		// Listen for any outside mouse clicks
		if (isSelected()) {
			document.addEventListener("click", handlePageClick);
		}

		if (isSelecting()) {
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("click", handlePageClick);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [select, dgDom]);

	return (
		<SelectableContext.Provider value={select}>
			<SelectableDispatchContext.Provider value={dispatch}>
				<span className="select-container" ref={dgDom}>
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
					row: action.payload.row,
					column: action.payload.column,
				},
				end: {
					row: action.payload.row,
					column: action.payload.column,
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
						row: action.payload.row,
						column: action.payload.column,
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
					row: action.payload.row,
					column: action.payload.column,
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
						row: action.payload.row,
						column: action.payload.column,
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
					row: action.payload.row,
					column: action.payload.column,
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
						row: action.payload.row,
						column: action.payload.column,
					},
				};
			}
		}
		case EVENT_SELECT_FINISHED: {
			console.debug("Action EVENT_SELECT_FINISHED triggered");

			return {
				...prevState,
				isSelectingCells: false,
				isSelectingRows: false,
				isSelectingColumns: false,
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
