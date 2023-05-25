import { useEditable, useEditableDispatch } from 'context/EditableContext';
import { useSelectable, useSelectableDispatch } from 'context/SelectableContext';
import { useTable, useTableDispatch } from 'context/TableContext';
import { updateBodyCellValue } from 'data/cell-state-operations';
import { editCellBegin, editCellFinish, editFinish } from 'data/edit-operations';
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
	const editable = useEditable();
	const dispatchTable = useTableDispatch();
	const dispatchSelectable = useSelectableDispatch();
	const dispatchEditable = useEditableDispatch();

	const { bodyRows, columns, bodyCells } = table.model;

	const handleMouseDownBodyCell = (row: number, column: number) => {
		console.debug("in handleMouseDownBodyCell");

		const isCellSelected =
			selectable.start &&
			selectable.end &&
			selectable.start.row == selectable.end.row &&
			selectable.start.row == row &&
			selectable.start.column == selectable.end.column &&
			selectable.start.column == column;

		if (!isCellSelected) {
			dispatchSelectable(selectCellBegin(row, column));
			console.debug(editable.isEditing)
			editable.isEditing && dispatchEditable(editFinish());
		}
	};

	const handleMouseOverBodyCell = (row: number, column: number) => {
		console.debug("in handleMouseOverBodyCell");

		if (selectable.isSelectingCells) {
			dispatchSelectable(selectCellAdd(row, column));
		}
	};

	const handleDoubleClickBodyCell = (cellId: string) => {
		console.debug("in handleDoubleClickBodyCell");

		dispatchEditable(editCellBegin(cellId));
		dispatchSelectable(selectClear());
	};

	const handleMouseDownRowHeader = (row: number) => {
		const lastColumnIndex = table.model.columns.length - 1;
		dispatchSelectable(selectRowBegin(row, lastColumnIndex));
	};

	const handleMouseOverRowHeader = (row: number) => {
		if (selectable.isSelectingRows) {
			const lastColumnIndex = table.model.columns.length - 1;
			dispatchSelectable(selectRowAdd(row, lastColumnIndex));
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
							{columns.map((column, columnIndex) => {
								const cell =
									bodyCells.find(
										(cell) =>
											cell.rowId === row.id &&
											cell.columnId === column.id
									) || createBodyCell(column.id, row.id);

								return (
									<React.Fragment key={cell.id}>
										<DataCell
											row={row.index}
											column={column.index}
											cell={cell}
											columnData={column}
											selected={isSelected(
												selectable,
												row.index,
												column.index
											)}
											// onMouseDown={e => handleTest(e, row.index, column.index)}
											onMouseDown={(event) =>
												handleMouseDownBodyCell(
													row.index,
													column.index
												)
											}
											onMouseOver={() => {
												handleMouseOverBodyCell(
													row.index,
													column.index
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
											row={row.index}
											col={column.index}
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
