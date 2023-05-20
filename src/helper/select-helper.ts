import { SelectedCellsType } from 'context/SelectContext';

export const isSelected = (
	selectedCells: SelectedCellsType,
	row: number,
	column: number
) => {
	return (
		selectedCells.start &&
		selectedCells.end &&
		row >= selectedCells.start.row &&
		row <= selectedCells.end.row &&
		column >= selectedCells.start.column &&
		column <= selectedCells.end.column
	);
};
