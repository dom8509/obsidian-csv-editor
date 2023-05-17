import { useSelectDispatch } from 'context/SelectContext';
import { useTable, useTableDispatch } from 'context/TableContext';
import { addColumn } from 'data/column-state-operations';
import { selectColumn } from 'data/select-operations';
import React from 'react';

import AddColumnButton from './AddColumnButton';
import ColumnHeader from './ColumnHeader';
import ColumnSeparator from './ColumnSeparator';

const HeaderRow = () => {
	const table = useTable();
	const dispatchTable = useTableDispatch();
	const dispatchSelect = useSelectDispatch();

	const { headerCells } = table.model;

	const handleMouseDown = (column: number, event: MouseEvent) => {
		const lastRowIndex = table.model.bodyRows.length;
		dispatchSelect(selectColumn(lastRowIndex, column));
	};

	const handleMouseOver = (column: number, event: MouseEvent) => {
		const lastRowIndex = table.model.bodyRows.length;
		dispatchSelect(selectColumn(lastRowIndex, column));
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

	console.log(table);
	return (
		<tr>
			<th key="booble" className="cell read-only" />
			{headerCells.map((cell, column) => {
				return (
					<React.Fragment key={cell.id}>
						<ColumnHeader
							key={`${cell.id}-value`}
							column={column}
							name={cell.markdown}
							onMouseDown={handleMouseDown}
							onMouseOver={handleMouseOver}
							onContextMenu={handleContextMenu}
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
