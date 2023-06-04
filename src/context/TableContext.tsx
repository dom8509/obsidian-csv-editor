import { addMatrixColumn, deleteMatrixColumns, insertMatrixColumn } from 'helper/matrix-helper';
import { createBodyCell, createBodyRow, createColumn, createHeaderCell } from 'helper/table-helper';
import React, {
    createContext, Dispatch, ReactNode, useContext, useEffect, useReducer
} from 'react';
import {
    EVENT_BODY_CELL_CLEARED, EVENT_BODY_CELL_UPDATED, EVENT_COLUMN_ADDED, EVENT_COLUMN_DELETED,
    EVENT_HEADER_CELL_CLEARED, EVENT_HEADER_CELL_UPDATED, EVENT_ROW_ADDED, EVENT_ROW_DELETED
} from 'types/events';

import {
    IBodyCell, IBodyRow, IHeaderCell, ISerializeableTableModel, ITableState
} from '../types/table';

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
			headerCellValuesCopy[action.payload.columnIndex] =
				action.payload.value;

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
			cellValuesCopy[action.payload.rowIndex][
				action.payload.columnIndex
			] = action.payload.value;

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
			cellValuesCopy[action.payload.rowIndex][
				action.payload.columnIndex
			] = "";

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
			const { cellValues } = prevState.serialization;

			// add new now
			const newRow = createBodyRow(action.payload.index);
			const newBodyRows = [...bodyRows].map((row) => {
				if (row.index >= action.payload.index) {
					row.index = row.index + 1;
				}
				return row;
			});
			newBodyRows.push(newRow);
			newBodyRows.sort((a, b) => a.index - b.index);

			// add new body cells
			const newBodyCells = [...bodyCells];
			columns.forEach((column) => {
				const newCell = createBodyCell(
					column.id,
					newRow.id,
					column.type
				);
				newBodyCells.push(newCell);
			});

			// add new row position
			const { rowPositions } = prevState.hashIndizes;
			const newRowPositions = new Map<string, number>(
				Array.from(rowPositions).map(([id, index]) => {
					if (index >= action.payload.index) {
						index = index + 1;
					}
					return [id, index];
				})
			);
			newRowPositions.set(newRow.id, newRow.index);

			// add cell values
			const newCellValuesRow = Array(columns.length).fill("");
			const newCellValues = [...cellValues];
			newCellValues.splice(action.payload.index, 0, newCellValuesRow);

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyCells: newBodyCells,
					bodyRows: newBodyRows,
				},
				hashIndizes: {
					...prevState.hashIndizes,
					rowPositions: newRowPositions,
				},
				serialization: {
					...prevState.serialization,
					cellValues: newCellValues,
				},
			};
		}
		case EVENT_ROW_DELETED: {
			console.log("Action EVENT_ROW_DELETED triggered");

			const { bodyRows, bodyCells } = prevState.model;
			const { rowPositions } = prevState.hashIndizes;
			const { cellValues } = prevState.serialization;

			const rowsToDeleteCount =
				action.payload.start - action.payload.end + 1;

			// Split rows in rows to delete and rows to keep
			const bodyRowsToDelete = [...bodyRows].filter(
				(row) =>
					row.index >= action.payload.start &&
					row.index <= action.payload.end
			);
			const bodyRowsToKeep = [...bodyRows]
				.filter(
					(row) =>
						row.index < action.payload.start ||
						row.index > action.payload.end
				)
				.map((row) => {
					if (row.index > action.payload.end) {
						row.index = row.index - 1;
					}
					return row;
				});

			// filter body cells to keey
			const rowIdsToDelete = bodyRowsToDelete.map((row) => row.id);
			const bodyCellsToKeep = [...bodyCells].filter((cell) => {
				return !rowIdsToDelete.contains(cell.rowId);
			});

			// filter row positions
			const rowPositionsToKeep = new Map<string, number>(
				Array.from(rowPositions)
					.filter(
						([_, index]) =>
							index < action.payload.start ||
							index > action.payload.end
					)
					.map(([id, index]) => {
						if (index > action.payload.end) {
							index = index - 1;
						}
						return [id, index];
					})
			);

			// filter cell values for serialization
			const cellValuesToKeep = cellValues.slice();
			cellValuesToKeep.splice(action.payload.start, rowsToDeleteCount);

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyCells: bodyCellsToKeep,
					bodyRows: bodyRowsToKeep,
				},
				hashIndizes: {
					...prevState.hashIndizes,
					rowPositions: rowPositionsToKeep,
				},
				serialization: {
					...prevState.serialization,
					cellValues: cellValuesToKeep,
				},
			};
		}
		case EVENT_COLUMN_ADDED: {
			console.log("Action EVENT_COLUMN_ADDED triggered");

			const { headerRows, columns, bodyRows, bodyCells, headerCells } =
				prevState.model;
			const { cellValues, headerCellValues } = prevState.serialization;

			// add new column
			const newColumn = createColumn(action.payload.index);
			const newColumns = [...columns].map((column) => {
				if (column.index >= action.payload.index) {
					column.index = column.index + 1;
				}
				return column;
			});
			newColumns.push(newColumn);
			newColumns.sort((a, b) => a.index - b.index);

			// add new header cell
			const newHeaderCells = [...headerCells];
			const newHeaderCell = createHeaderCell(
				newColumn.id,
				headerRows[0].id
			);
			newHeaderCell.markdown = "Column " + (newColumn.index + 1);
			newHeaderCells.push(newHeaderCell);

			// add new body cells
			const newBodyCells = structuredClone(bodyCells);
			bodyRows.forEach((row) => {
				const newCell = createBodyCell(
					newColumn.id,
					row.id,
					newColumn.type
				);
				newBodyCells.push(newCell);
			});

			// add new column position
			const { columnPositions } = prevState.hashIndizes;
			const newColumnPositions = new Map<string, number>(
				Array.from(columnPositions).map(([id, index]) => {
					if (index >= action.payload.index) {
						index = index + 1;
					}
					return [id, index];
				})
			);
			newColumnPositions.set(newColumn.id, newColumn.index);

			// add new cell values
			const newCellValues = insertMatrixColumn(
				cellValues,
				action.payload.index,
				Array<string>(cellValues.length).fill("")
			);

			// add new header value
			const newHeaderCellValues = [...headerCellValues];
			newHeaderCellValues.splice(
				action.payload.index,
				0,
				"Column " + (newColumn.index + 1)
			);

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyCells: newBodyCells,
					columns: newColumns,
					headerCells: newHeaderCells,
				},
				hashIndizes: {
					...prevState.hashIndizes,
					columnPositions: newColumnPositions,
				},
				serialization: {
					...prevState.serialization,
					headerCellValues: newHeaderCellValues,
					cellValues: newCellValues,
				},
			};
		}
		case EVENT_COLUMN_DELETED: {
			console.log("Action EVENT_COLUMN_DELETED triggered");

			const { columns, bodyCells, headerCells } = prevState.model;
			const { columnPositions } = prevState.hashIndizes;
			const { headerCellValues, cellValues } = prevState.serialization;

			const columnsToDeleteCount =
				action.payload.start - action.payload.end + 1;

			// Split columns in columns to delete and columns to keep
			const columnsToDelete = [...columns].filter(
				(column) =>
					column.index >= action.payload.start &&
					column.index <= action.payload.end
			);
			const columnsToKeep = [...columns]
				.filter(
					(column) =>
						column.index < action.payload.start ||
						column.index > action.payload.end
				)
				.map((column) => {
					if (column.index > action.payload.end) {
						column.index = column.index - 1;
					}
					return column;
				});

			// filter header cells to keep
			const headerCellsToKeep = [...headerCells].filter((headerCell) => {
				const currentColumnIndex = columnPositions.get(
					headerCell.columnId
				);
				return (
					currentColumnIndex != undefined &&
					(currentColumnIndex < action.payload.start ||
						currentColumnIndex > action.payload.end)
				) 
			});

			// filter body cells to keep
			const columnIdsToDelete = columnsToDelete.map(
				(column) => column.id
			);
			const bodyCellsToKeep = [...bodyCells].filter((cell) => {
				return !columnIdsToDelete.contains(cell.columnId);
			});

			// filter row positions
			const columnPositionsToKeep = new Map<string, number>(
				Array.from(columnPositions)
					.filter(
						([_, index]) =>
							index < action.payload.start ||
							index > action.payload.end
					)
					.map(([id, index]) => {
						if (index > action.payload.end) {
							index = index - 1;
						}
						return [id, index];
					})
			);

			// filter cell values for serialization
			console.log("cellValues: ", cellValues);
			const cellValuesToKeep = deleteMatrixColumns(
				cellValues,
				action.payload.start,
				columnsToDeleteCount
			);
			console.log("cellValuesToKeep: ", cellValuesToKeep);

			// filter header cell values for serialization
			const headerCellValuesToKeep = [...headerCellValues];
			headerCellValuesToKeep.splice(
				action.payload.start,
				columnsToDeleteCount
			);

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyCells: bodyCellsToKeep,
					columns: columnsToKeep,
					headerCells: headerCellsToKeep,
				},
				hashIndizes: {
					...prevState.hashIndizes,
					columnPositions: columnPositionsToKeep,
				},
				serialization: {
					...prevState.serialization,
					headerCellValues: headerCellValuesToKeep,
					cellValues: cellValuesToKeep,
				},
			};
		}
		default: {
			console.error("Unknown action: " + action.type);
			return prevState;
		}
	}
};
