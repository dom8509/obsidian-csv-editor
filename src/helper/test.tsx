import TableProvider, { useTable, useTableDispatch } from 'context/TableContext';
import React from 'react';
import { EVENT_BODY_CELL_UPDATED } from 'types/events';

import { updateCell } from './cell-actions';
import { createInitialTable } from './data-serializer';

export default function TaskApp() {
	const handleDataChanged = () => {
		/* save data here */
	}

	return (
		<TableProvider onDataChanged={handleDataChanged} initialState={createInitialTable()}>
			<h1>Day off in Kyoto</h1>
			<AddCell />
		</TableProvider>
	);
}

export function AddCell() {
	const table = useTable();
	const dispatch = useTableDispatch();

	dispatch(updateCell(1, "test"));

	dispatch({ type: EVENT_BODY_CELL_UPDATED });

	return <p>test</p>;
}
