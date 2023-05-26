import EditableProvider from 'context/EditableContext';
import React from 'react';

import BodyRows from './BodyRows';
import HeaderRow from './HeaderRow';

const DataSheet = () => {
	// const dispatchTable = useTableDispatch();

	// const handleCommit = (
	// 	cellId: string,
	// 	column: number,
	// 	row: number,
	// 	value: string
	// ) => {
	// 	dispatchTable(
	// 		updateBodyCellValue(cellId, column, row, value)
	// 	);
	// };

	return (
		<EditableProvider>
			<span className="data-sheet-container">
				<table className="data-sheet">
					<tbody>
						{/* header row */}
						<HeaderRow />
						<BodyRows />
					</tbody>
				</table>
			</span>
		</EditableProvider>
	);
};

export default DataSheet;
