import { addMatrixColumn } from 'helper/matrix-helper';
import { createBodyCell, createBodyRow, createColumn, createHeaderCell } from 'helper/table-helper';
import React, {
    createContext, Dispatch, ReactNode, useContext, useEffect, useReducer
} from 'react';
import {
    EVENT_BODY_CELL_CLEARED, EVENT_BODY_CELL_UPDATED, EVENT_COLUMN_ADDED, EVENT_HEADER_CELL_CLEARED,
    EVENT_HEADER_CELL_UPDATED, EVENT_ROW_ADDED
} from 'types/events';

import { IBodyCell, IHeaderCell, ISerializeableTableModel, ITableState } from '../types/table';

interface Props {
	onChange: (data: ISerializeableTableModel) => void;
	initialState: ITableState;
	children: ReactNode;
}

const TableContext = createContext<ITableState | undefined>(undefined);
const TableDispatchContext = createContext<Dispatch<any> | undefined>(
	undefined
);

export const useTable = () => {
	const context = useContext(TableContext);
	if (context === undefined) {
		throw new Error(
			"useTable() called without a <TableProvider /> in the tree."
		);
	}
	return context;
};

export const useTableDispatch = () => {
	const context = useContext(TableDispatchContext);
	if (context === undefined) {
		throw new Error(
			"useTableDispatch() called without a <TableProvider /> in the tree."
		);
	}
	return context;
};

export default function TableProvider({
	onChange,
	initialState,
	children,
}: Props) {
	const [table, dispatch] = useReducer(tableReducer, initialState);

	useEffect(() => {
		onChange(table.serialization);
	}, [table.serialization]);

	return (
		<TableContext.Provider value={table}>
			<TableDispatchContext.Provider value={dispatch}>
				{children}
			</TableDispatchContext.Provider>
		</TableContext.Provider>
	);
}

const tableReducer = (prevState: ITableState, action: any): ITableState => {
	switch (action.type) {
		case EVENT_HEADER_CELL_UPDATED: {
			console.log("Action EVENT_HEADER_CELL_UPDATED triggered");

			const headerCellValuesCopy = structuredClone(
				prevState.serialization.headerCellValues
			);
			headerCellValuesCopy[action.payload.columnIndex] = action.payload.value;

			return {
				...prevState,
				model: {
					...prevState.model,
					headerCells: prevState.model.headerCells.map((cell) => {
						if (cell.id == action.payload.cellId) {
							return {
								...cell,
								[action.payload.key as keyof IHeaderCell]:
									action.payload.value,
							};
						}
						return cell;
					}),
				},
				serialization: {
					...prevState.serialization,
					headerCellValues: headerCellValuesCopy,
				},
			};
		}
		case EVENT_HEADER_CELL_CLEARED: {
			console.log("Action EVENT_HEADER_CELL_CLEARED triggered");

			const headerCellValuesCopy = structuredClone(
				prevState.serialization.headerCellValues
			);
			headerCellValuesCopy[action.payload.columnIndex] =
				"Column " + (action.payload.column + 1);

			return {
				...prevState,
				model: {
					...prevState.model,
					headerCells: prevState.model.headerCells.map((cell) => {
						if (cell.id == action.payload.cellId) {
							return {
								...cell,
								[action.payload.key as keyof IBodyCell]: "",
							};
						}
						return cell;
					}),
				},
			};
		}
		case EVENT_BODY_CELL_UPDATED: {
			console.log("Action EVENT_BODY_CELL_UPDATED triggered");

			const cellValuesCopy = structuredClone(
				prevState.serialization.cellValues
			);
			cellValuesCopy[action.payload.rowIndex][action.payload.columnIndex] =
				action.payload.value;

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyCells: prevState.model.bodyCells.map((cell) => {
						if (cell.id == action.payload.cellId) {
							return {
								...cell,
								[action.payload.key as keyof IBodyCell]:
									action.payload.value,
							};
						}
						return cell;
					}),
				},
				serialization: {
					...prevState.serialization,
					cellValues: cellValuesCopy,
				},
			};
		}
		case EVENT_BODY_CELL_CLEARED: {
			console.log("Action EVENT_BODY_CELL_CLEARED triggered");

			const cellValuesCopy = structuredClone(
				prevState.serialization.cellValues
			);
			cellValuesCopy[action.payload.rowIndex][action.payload.columnIndex] = "";

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyCells: prevState.model.bodyCells.map((cell) => {
						if (cell.id == action.payload.cellId) {
							return {
								...cell,
								[action.payload.key as keyof IBodyCell]: "",
							};
						}
						return cell;
					}),
				},
				serialization: {
					...prevState.serialization,
					cellValues: cellValuesCopy,
				},
			};
		}
		case EVENT_ROW_ADDED: {
			console.log("Action EVENT_ROW_ADDED triggered");

			const { bodyRows, bodyCells, columns } = prevState.model;
			const newRow = createBodyRow(bodyRows.length);
			const cellsCopy = structuredClone(bodyCells);

			const { cellValues } = prevState.serialization;
			const newCellValuesRow = Array(columns.length).fill("");

			columns.forEach((column) => {
				const newCell = createBodyCell(
					column.id,
					newRow.id,
					column.type
				);
				cellsCopy.push(newCell);
			});

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyCells: cellsCopy,
					bodyRows: [...bodyRows, newRow],
				},
				serialization: {
					...prevState.serialization,
					cellValues: [...cellValues, newCellValuesRow],
				},
			};
		}
		case EVENT_COLUMN_ADDED: {
			console.log("Action EVENT_COLUMN_ADDED triggered");

			const { headerRows, columns, bodyRows, bodyCells, headerCells } =
				prevState.model;
			const newColumn = createColumn(columns.length);
			const newHeaderCell = createHeaderCell(
				newColumn.id,
				headerRows[0].id
			);
			newHeaderCell.markdown = "Column " + (newColumn.index + 1);

			const { cellValues, headerCellValues } = prevState.serialization;
			const newCellValues = addMatrixColumn(cellValues, "");
			const newHeaderCellValue = "Column " + (newColumn.index + 1);

			const cellsCopy = structuredClone(bodyCells);
			bodyRows.forEach((row) => {
				const newCell = createBodyCell(
					newColumn.id,
					row.id,
					newColumn.type
				);
				cellsCopy.push(newCell);
			});

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyCells: cellsCopy,
					columns: [...columns, newColumn],
					headerCells: [...headerCells, newHeaderCell],
				},
				serialization: {
					...prevState.serialization,
					headerCellValues: [...headerCellValues, newHeaderCellValue],
					cellValues: newCellValues,
				},
			};
		}
		default: {
			console.error("Unknown action: " + action.type);
			return prevState;
		}
	}
};
