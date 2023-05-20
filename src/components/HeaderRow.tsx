import { useSelect, useSelectDispatch } from 'context/SelectContext';
import { useTable, useTableDispatch } from 'context/TableContext';
import { updateHeaderCellValue } from 'data/cell-state-operations';
import { addColumn } from 'data/column-state-operations';
import { selectColumnAdd, selectColumnBegin } from 'data/select-operations';
import React from 'react';
import { IColumn, IHeaderCell } from 'types/table';

import AddColumnButton from './AddColumnButton';
import ColumnSeparator from './ColumnSeparator';
import DataCell from './DataCell';

const HeaderRow = () => {
	const table = useTable();
	console.log("useTable: "); console.log(useTable)
	const select = useSelect();
	console.log("useSelect: "); console.log(select)
	const dispatchTable = useTableDispatch();
	const dispatchSelect = useSelectDispatch();

	const { headerCells, columns } = table.model;

	const handleMouseDown = (column: number, event: MouseEvent) => {
		// const lastRowIndex = table.model.bodyRows.length;
		// dispatchSelect(selectColumnBegin(lastRowIndex, column));
	};

	const handleMouseOver = (column: number, event: MouseEvent) => {
		// const lastRowIndex = table.model.bodyRows.length;
		if (select.isSelectingColumns) {
			// dispatchSelect(selectColumnAdd(lastRowIndex, column));
		}
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
		} else {
			console.log("Error: column index not found in columnPositions");
		}
	};

	console.log(table);
	return (
		<tr>
			<th key="booble" className="cell read-only" />
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
							onMouseDown={handleMouseDown}
							onMouseOver={handleMouseOver}
							onDoubleClick={() => {}}
							onContextMenu={handleContextMenu}
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
