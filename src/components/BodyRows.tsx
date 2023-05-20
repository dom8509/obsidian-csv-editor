import { useSelect, useSelectDispatch } from 'context/SelectContext';
import { useTable, useTableDispatch } from 'context/TableContext';
import { updateBodyCellValue } from 'data/cell-state-operations';
import { addRow } from 'data/row-state-operations';
import { selectCellAdd, selectCellBegin, selectClear, selectFinish } from 'data/select-operations';
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
	const select = useSelect();
	const dispatchTable = useTableDispatch();
	const dispatchSelect = useSelectDispatch();

	const { bodyRows, columns, bodyCells } = table.model;

	const handleMouseDown = (row: number, column: number) => {
		// console.debug("in handleMouseDown")
		// // Keep listening to mouse if user releases the mouse (dragging outside)
		// document.addEventListener("mouseup", handleMouseUp);
		// // Listen for any outside mouse clicks
		// document.addEventListener("mousedown", handlePageClick);

		// dispatchSelect(selectCellBegin(row, column));

		// console.debug("in handleMouseDown end")
	};

	const handleMouseOver = (row: number, column: number) => {
		// if (select.isSelectingCells) {
		// 	const val = selectCellAdd(row, column);
		// 	console.debug("calling dispatch with action:"), console.debug(val);
		// 	dispatchSelect(val);
		// }
	};

	const handleMouseUp = () => {
		// console.debug("in handleMouseUp 2")
		// console.debug(select)

		// document.removeEventListener("mouseup", handleMouseUp);
		// document.removeEventListener("mousedown", handlePageClick);

		// if (select.isSelectingCells) {
		// 	console.debug("in handleMouseUp with isSelectingCells")
		// 	const val = selectFinish();
		// 	console.debug("calling dispatch with action:"), console.debug(val);

		// 	dispatchSelect(val);
		// }
	};

	const handlePageClick = () => {
		// console.debug("In handlePageClick");
		
		// if (select.isSelectingCells) {
		// 	dispatchSelect(selectClear());
		// }

		// document.removeEventListener("mouseup", handleMouseUp);
		// document.removeEventListener("mousedown", handlePageClick);
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
			console.log("Error: column or row index not found");
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
								onMouseDown={handleMouseDown}
								onMouseOver={handleMouseOver}
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
												select,
												row.index,
												column.index
											)}
											onMouseDown={() =>
												handleMouseDown(
													row.index,
													column.index
												)
											}
											onMouseOver={() => {
												handleMouseOver(
													row.index,
													column.index
												);
											}}
											onDoubleClick={() => {}}
											onContextMenu={handleContextMenu}
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
