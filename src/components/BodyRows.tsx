import { useSelect, useSelectDispatch } from 'context/SelectableContext';
import { useTable, useTableDispatch } from 'context/TableContext';
import { updateBodyCellValue } from 'data/cell-state-operations';
import { addRow } from 'data/row-state-operations';
import {
    selectCellAdd, selectCellBegin, selectRowAdd, selectRowBegin
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
	const select = useSelect();
	const dispatchTable = useTableDispatch();
	const dispatchSelect = useSelectDispatch();

	const { bodyRows, columns, bodyCells } = table.model;

	const handleMouseDownBodyCell = (row: number, column: number) => {
		dispatchSelect(selectCellBegin(row, column));
	};

	const handleMouseOverBodyCell = (row: number, column: number) => {
		if (select.isSelectingCells) {
			dispatchSelect(selectCellAdd(row, column));
		}
	};

	const handleMouseDownRowHeader = (row: number) => {
		const lastColumnIndex = table.model.columns.length - 1;
		dispatchSelect(selectRowBegin(row, lastColumnIndex));
	};

	const handleMouseOverRowHeader = (row: number) => {
		if (select.isSelectingRows) {
			const lastColumnIndex = table.model.columns.length - 1;
			dispatchSelect(selectRowAdd(row, lastColumnIndex));
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
								onMouseDown={() => handleMouseDownRowHeader(row.index)}
								onMouseOver={() => handleMouseOverRowHeader(row.index)}
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
