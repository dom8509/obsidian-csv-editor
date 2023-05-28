export const addMatrixColumn = (matrix: any[][], initialValue: any): any[][] => {
	const newColumn = Array<typeof matrix>(matrix.length).fill(initialValue);
	return matrix.map((row, index) => [...row, newColumn[index]]);
};
