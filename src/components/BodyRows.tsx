import { useEditable } from 'context/EditableContext';
import { useSelectable, useSelectableDispatch } from 'context/SelectableContext';
import { useTable, useTableDispatch } from 'context/TableContext';
import { updateBodyCellValue } from 'data/cell-state-operations';
import { editCellFinish, editCellStart } from 'data/edit-operations';
import { addRow } from 'data/row-state-operations';
import {
    selectCellAdd, selectCellBegin, selectClear, selectRowAdd, selectRowBegin
} from 'data/select-operations';
import { isSelected } from 'helper/select-helper';
import { createBodyCell } from 'helper/table-helper';
import React from 'react';
import { IBodyCell } from 'types/table';
import { v4 as uuidv4 } from 'uuid';

import AddRowButton from './AddRowButton';
import ColumnSeparator from './ColumnSeparator';
import DataCell from './DataCell';
import RowHeader from './RowHeader';

const BodyRows = () => {
	const table = useTable();
	const selectable = useSelectable();
	const [editable, dispatchEditable] = useEditable();
	const dispatchTable = useTableDispatch();
	const dispatchSelectable = useSelectableDispatch();

	const { bodyRows, columns, bodyCells } = table.model;

	const handleMouseDownBodyCell = (column: number, row: number) => {
		console.debug("in handleMouseDownBodyCell");

		const isNotEditing = editable.cellId === undefined;

		const isCellSelected =
			selectable.start &&
			selectable.end &&
			selectable.start.column == selectable.end.column &&
			selectable.start.column == column &&
			selectable.start.row == selectable.end.row &&
			selectable.start.row == row;

		if (!isCellSelected && isNotEditing) {
			dispatchSelectable(selectCellBegin(column, row));
		}
	};

	const handleMouseOverBodyCell = (column: number, row: number) => {
		console.debug("in handleMouseOverBodyCell");

		if (selectable.isSelectingCells) {
			dispatchSelectable(selectCellAdd(column, row));
		}
	};

	const handleDoubleClickBodyCell = (cellId: string) => {
		console.debug("in handleDoubleClickBodyCell");

		dispatchEditable(editCellStart(cellId));
	};

	const handleMouseDownRowHeader = (row: number) => {
		const lastColumnIndex = table.model.columns.length - 1;
		dispatchSelectable(selectRowBegin(lastColumnIndex, row));
	};

	const handleMouseOverRowHeader = (row: number) => {
		if (selectable.isSelectingRows) {
			const lastColumnIndex = table.model.columns.length - 1;
			dispatchSelectable(selectRowAdd(lastColumnIndex, row));
		}
	};

	const handleContextMenu = () => {
		//TODO: implement me
	};

	// const handleMouseDownSeparator = () => {
	// 	//TODO: implement me
	// };

	// const handleDoubleClickSeparator = () => {
	// 	//TODO: implement me
	// };

	const handleAddRowClicked = () => {
		dispatchTable(addRow());
	};

	const handleChange = (cell: IBodyCell, value: string) => {
		const rowIndex = table.hashIndizes.rowPositions.get(cell.rowId);
		const columnIndex = table.hashIndizes.columnPositions.get(
			cell.columnId
		);
		if (columnIndex != undefined && rowIndex != undefined) {
			dispatchTable(
				updateBodyCellValue(cell.id, columnIndex, rowIndex, value)
			);
			editable.cellId && dispatchEditable(editCellFinish());
		} else {
			console.error("Column or row index not found");
		}
	};

	return (
		<React.Fragment key={uuidv4()}>
			{bodyRows.map((row) => {
				return (
					<React.Fragment key={uuidv4()}>
						<tr key={uuidv4()}>
							<RowHeader
								key={uuidv4()}
								row={row.index}
								onMouseDown={() =>
									handleMouseDownRowHeader(row.index)
								}
								onMouseOver={() =>
									handleMouseOverRowHeader(row.index)
								}
								onContextMenu={handleContextMenu}
							/>
							{columns.map((column) => {
								const cell =
									bodyCells.find(
										(cell) =>
											cell.columnId === column.id &&
											cell.rowId === row.id
									) || createBodyCell(column.id, row.id);

								return (
									<React.Fragment key={cell.id}>
										<DataCell
											column={column.index}
											row={row.index}
											cell={cell}
											columnData={column}
											selected={isSelected(
												selectable,
												row.index,
												column.index
											)}
											onMouseDown={(event) =>
												handleMouseDownBodyCell(
													column.index,
													row.index
												)
											}
											onMouseOver={() => {
												handleMouseOverBodyCell(
													column.index,
													row.index
												);
											}}
											onDoubleClick={() => {
												handleDoubleClickBodyCell(
													cell.id
												);
											}}
											onChange={handleChange}
										/>
										<ColumnSeparator
											col={column.index}
											row={row.index}
											key={uuidv4()}
											onMouseDown={() => {}}
											onDoubleClick={() => {}}
											onContextMenu={() => {}}
										/>
									</React.Fragment>
								);
							})}
						</tr>
					</React.Fragment>
				);
			})}
			<tr>
				<AddRowButton onMouseDown={handleAddRowClicked} />
			</tr>
		</React.Fragment>
	);
};

export default BodyRows;
