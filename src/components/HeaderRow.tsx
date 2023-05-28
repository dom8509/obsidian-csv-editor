import { useEditable } from 'context/EditableContext';
import { useSelectable, useSelectableDispatch } from 'context/SelectableContext';
import { useTable, useTableDispatch } from 'context/TableContext';
import { updateHeaderCellValue } from 'data/cell-state-operations';
import { addColumn } from 'data/column-state-operations';
import { editCellFinish, editCellStart } from 'data/edit-operations';
import { selectClear, selectColumnAdd, selectColumnBegin } from 'data/select-operations';
import React from 'react';
import { IColumn, IHeaderCell } from 'types/table';

import AddColumnButton from './AddColumnButton';
import ColumnSeparator from './ColumnSeparator';
import DataCell from './DataCell';

const HeaderRow = () => {
	const table = useTable();
	const selectable = useSelectable();
	const [editable, dispatchEditable] = useEditable();
	const dispatchTable = useTableDispatch();
	const dispatchSelectable = useSelectableDispatch();

	const { headerCells, columns } = table.model;

	const handleMouseDownBooble = () => {
		console.debug("in HeaderRow::handleMouseDownBooble");

		const isNotEditing = editable.cellId === undefined;

		if (isNotEditing) {
			const lastColumnIndex = table.model.columns.length - 1;
			const lastRowIndex = table.model.bodyRows.length - 1;
			dispatchSelectable(selectColumnBegin(0, lastRowIndex));
			dispatchSelectable(selectColumnAdd(lastColumnIndex, lastRowIndex));
		}
	};

	const handleMouseDown = (column: number) => {
		console.debug("in HeaderRow::handleMouseDown");

		const isNotEditing = editable.cellId === undefined;

		const isCellSelected =
			selectable.start &&
			selectable.end &&
			selectable.start.column == selectable.end.column &&
			selectable.start.column == column;

		if (!isCellSelected && isNotEditing) {
			const lastRowIndex = table.model.bodyRows.length - 1;
			dispatchSelectable(selectColumnBegin(column, lastRowIndex));
		}
	};

	const handleMouseOver = (column: number) => {
		console.debug("in HeaderRow::handleMouseDown");

		if (selectable.isSelectingColumns) {
			const lastRowIndex = table.model.bodyRows.length - 1;
			dispatchSelectable(selectColumnAdd(column, lastRowIndex));
		}
	};

	const handleDoubleClick = (cellId: string) => {
		console.debug("in HeaderRow::handleDoubleClick");

		dispatchEditable(editCellStart(cellId));
		dispatchSelectable(selectClear());
	};

	const handleContextMenu = () => {
		//TODO: implement me
	};

	const handleMouseDownSeparator = () => {
		//TODO: implement me
	};

	const handleDoubleClickSeparator = () => {
		//TODO: implement me
	};

	const handleAddColumnClicked = () => {
		dispatchTable(addColumn());
	};

	const handleChange = (cell: IHeaderCell, value: string) => {
		const columnIndex = table.hashIndizes.columnPositions.get(
			cell.columnId
		);
		if (columnIndex != undefined) {
			dispatchTable(updateHeaderCellValue(cell.id, columnIndex, value));
			editable.cellId && dispatchEditable(editCellFinish());
		} else {
			console.error("Column index not found in columnPositions");
		}
	};

	return (
		<tr>
			<th
				key="booble"
				className="cell read-only"
				onMouseDown={handleMouseDownBooble}
			/>
			{headerCells.map((cell, column) => {
				return (
					<React.Fragment key={cell.id}>
						<DataCell
							row={0}
							column={column}
							cell={cell}
							columnData={
								columns.find(
									(column) => column.id == cell.columnId
								) as IColumn
							}
							className="column-header"
							onMouseDown={() => handleMouseDown(column)}
							onMouseOver={() => handleMouseOver(column)}
							onDoubleClick={() => handleDoubleClick(cell.id)}
							// onContextMenu={handleContextMenu}
							onChange={handleChange}
						/>
						<ColumnSeparator
							row={0}
							col={column}
							key={`${cell.id}-sep`}
							onMouseDown={handleMouseDownSeparator}
							onDoubleClick={handleDoubleClickSeparator}
							onContextMenu={handleContextMenu}
						/>
					</React.Fragment>
				);
			})}
			<AddColumnButton onMouseDown={handleAddColumnClicked} />
		</tr>
	);
};

export default HeaderRow;
