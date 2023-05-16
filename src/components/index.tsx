import TableProvider from 'context/TableContext';
import React from 'react';
import { TableState } from 'types/table';

import Cell from './Cell';
import { CsvSheet } from './CsvSheet';
import DataEditor from './DataEditor';
import DataSheet from './DataSheet';
import { renderData, renderValue } from './renderHelpers';
import Row from './Row';
import Sheet from './Sheet';
import ValueViewer from './ValueViewer';

export {
	DataSheet,
	Sheet,
	Row,
	Cell,
	DataEditor,
	ValueViewer,
	renderValue,
	renderData,
};

export const createSheet = (data: TableState, onDataChangedCallback: any) => {
	return (
		<React.StrictMode>
			<TableProvider
				onDataChanged={onDataChangedCallback}
				initialState={data}
			>
				<DataSheet />
			</TableProvider>
		</React.StrictMode>
	);
};
