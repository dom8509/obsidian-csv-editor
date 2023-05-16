export const updateHeaderCell = (id: string, column: number, value: any) => {
	return {
		cellId: id,
		columnIndex: column,
		value: value,
	};
};

export const clearHeaderCell = (id: string, column: number, value: any) => {
	return {
		cellId: id,
		columnIndex: column,
	};
};

export const updateCell = (
	id: string,
	column: number,
	row: number,
	value: any
) => {
	return {
		cellId: id,
		columnIndex: column,
		rowIndex: row,
		value: value,
	};
};

export const clearCell = (id: string, column: number, row: number) => {
	return {
		cellId: id,
		columnIndex: column,
		rowIndex: row,
	};
};
