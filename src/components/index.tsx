import SelectProvider from 'context/SelectContext';
import TableProvider from 'context/TableContext';
import React from 'react';
import { ITableState } from 'types/table';

import Cell from './Cell';
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

export const createSheet = (data: ITableState, onDataChanged: any) => {
	return (
		<React.StrictMode>
			<TableProvider
				onDataChanged={onDataChanged}
				initialState={data}
			>
				<SelectProvider>
					<DataSheet />
				</SelectProvider>
			</TableProvider>
		</React.StrictMode>
	);
};
