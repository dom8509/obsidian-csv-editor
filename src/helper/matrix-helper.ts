export const addMatrixColumn = (
	matrix: any[][],
	initialValue: any
): any[][] => {
	const newColumn = Array<typeof matrix>(matrix.length).fill(initialValue);
	return matrix.map((row, rowIndex) => [...row, newColumn[rowIndex]]);
};

export const insertMatrixColumn = (
	matrix: any[][],
	index: number,
	values: any[]
): any[][] => {
	return matrix.map((row, rowIndex) => {
		row.splice(index, 0, values[rowIndex]);
		return row;
	});
};

export const deleteMatrixColumns = (
	matrix: any[][],
	index: number,
	count: number
): any[][] => {
	return matrix.map((row) => {
		row.splice(index, count);
		return row;
	});
};
