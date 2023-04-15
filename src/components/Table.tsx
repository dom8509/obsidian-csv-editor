import 'react-data-grid/lib/styles.css';

import React from 'react';
import DataGrid from 'react-data-grid';

export type TableColumn = {
	key: string;
	name: string;
};

export type TableRow = any;

export type TableData = {
	columns: Array<TableColumn>;
	rows: Array<TableRow>;
};

// const columns = [
//   { key: 'id', name: 'ID' },
//   { key: 'title', name: 'Title' }
// ];

// const rows = [
//   { id: 0, title: 'Example' },
//   { id: 1, title: 'Demo' }
// ];

export function createTable(
	columns: Array<TableColumn>,
	rows: Array<TableRow>
) {
	const data: TableData = { rows, columns };
	// return <Table {...data} />;
	return <Table />;
}
const columns = [
	{ key: "id", name: "ID" },
	{ key: "title", name: "Title" },
];

const rows = [
	{ id: 0, title: "Example" },
	{ id: 1, title: "Demo" },
];

function rowKeyGetter(row: any) {
  return row.id;
}

// export function Table({columns, rows}: TableData) {
export function Table() {
	return (
		<DataGrid
			rowKeyGetter={rowKeyGetter}
			columns={columns}
			rows={rows}
			defaultColumnOptions={{
				sortable: true,
				resizable: true,
			}}
			className="fill-grid"
		/>
	);
}
