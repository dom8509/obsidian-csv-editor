import { useEditable } from 'context/EditableContext';
import { useSelectable, useSelectableDispatch } from 'context/SelectableContext';
import { useTable, useTableDispatch } from 'context/TableContext';
import { updateBodyCellValue } from 'data/cell-state-operations';
import { editCellFinish, editCellStart } from 'data/edit-operations';
import { addRow } from 'data/row-state-operations';
import {
    selectCellAdd, selectCellBegin, selectRowAdd, selectRowBegin
} from 'data/select-operations';
import { isSelected } from 'helper/select-helper';
import { createBodyCell } from 'helper/table-helper';
import React from 'react';
import { LEFT_MOUSE_BTN, RIGHT_MOUSE_BTN } from 'types/mouse';
import { IBodyCell } from 'types/table';
import { v4 as uuidv4 } from 'uuid';

import AddRowButton from './AddRowButton';
import ColumnSeparator from './ColumnSeparator';
import DataCell from './DataCell';
import RowHeader from './RowHeader';
import RowSeparator from './RowSeparator';

const BodyRows = () => {
	const table = useTable();
	const selectable = useSelectable();
	const [editable, dispatchEditable] = useEditable();
	const dispatchTable = useTableDispatch();
	const dispatchSelectable = useSelectableDispatch();

	const { bodyRows, columns, bodyCells } = table.model;

	const handleMouseDownBodyCell = (
		event: MouseEvent,
		column: number,
		row: number
	) => {
		console.log("in handleMouseDownBodyCell");

		const isEditing = editable.cellId != undefined;

		const isCellSelected =
			selectable.start &&
			selectable.end &&
			selectable.start.column == selectable.end.column &&
			selectable.start.column == column &&
			selectable.start.row == selectable.end.row &&
			selectable.start.row == row;

		if (
			(event.button === LEFT_MOUSE_BTN &&
				!isCellSelected &&
				!isEditing) /* handled by EditableContext Click */ ||
			(event.button === RIGHT_MOUSE_BTN &&
				!isSelected(selectable, row, column))
		) {
			dispatchSelectable(selectCellBegin(column, row));
		}
	};

	const handleMouseOverBodyCell = (column: number, row: number) => {
		console.log("in handleMouseOverBodyCell");

		if (selectable.isSelectingCells) {
			dispatchSelectable(selectCellAdd(column, row));
		}
	};

	const handleDoubleClickBodyCell = (event: MouseEvent, cellId: string) => {
		console.debug("in handleDoubleClickBodyCell");

		if (event.button === LEFT_MOUSE_BTN) {
			dispatchEditable(editCellStart(cellId));
		}
	};

	const handleMouseDownRowHeader = (row: number) => {
		const isEditing = editable.cellId != undefined;

		if (!isEditing) {
			const lastColumnIndex = table.model.columns.length - 1;
			dispatchSelectable(selectRowBegin(lastColumnIndex, row));
		}
	};

	const handleMouseOverRowHeader = (row: number) => {
		if (selectable.isSelectingRows) {
			const lastColumnIndex = table.model.columns.length - 1;
			dispatchSelectable(selectRowAdd(lastColumnIndex, row));
		}
	};

	const handleAddRowClicked = () => {
		dispatchTable(addRow(table.model.bodyRows.length));
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
								onContextMenu={() => {}}
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
													event,
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
											onDoubleClick={(event) => {
												handleDoubleClickBodyCell(
													event,
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
						<tr>
							<RowSeparator
								row={row.index}
								col={0}
								key={uuidv4()}
								// onMouseDown={this.onMouseDown}
								// onDoubleClick={() => {}}
								// onContextMenu={this.onContextMenu}
							/>
							{columns.map((column) => {
								return (
									<React.Fragment key={uuidv4()}>
										<RowSeparator
											row={row.index}
											col={column.index}
											key={uuidv4()}
											// onMouseDown={this.onMouseDown}
											// onDoubleClick={() => {}}
											// onContextMenu={this.onContextMenu}
										/>
										<td className="cell read-only separator" />
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
