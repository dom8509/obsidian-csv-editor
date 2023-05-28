import { SelectedCellsType } from 'context/SelectableContext';

import { max2, min2 } from './compare-helper';

export const isSelected = (
	selectedCells: SelectedCellsType,
	row: number,
	column: number
) => {
	if (!selectedCells.start || !selectedCells.end) {
		return false;
	}

	const currentStart = {
		row: min2(selectedCells.start.row, selectedCells.end.row),
		column: min2(selectedCells.start.column, selectedCells.end.column),
	};
	const currentEnd = {
		row: max2(selectedCells.start.row, selectedCells.end.row),
		column: max2(selectedCells.start.column, selectedCells.end.column),
	};

	return (
		row >= currentStart.row &&
		row <= currentEnd.row &&
		column >= currentStart.column &&
		column <= currentEnd.column
	);
};
