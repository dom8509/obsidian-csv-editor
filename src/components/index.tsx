import './react-datasheet.css';

import SelectProvider from 'context/SelectContext';
import TableProvider from 'context/TableContext';
import React from 'react';
import { ITableState } from 'types/table';

import DataSheet from './DataSheet';

export const createSheet = (data: ITableState, onDataChanged: any) => {
	return (
		<React.StrictMode>
			<TableProvider onDataChanged={onDataChanged} initialState={data}>
				<SelectProvider>
					<DataSheet />
				</SelectProvider>
			</TableProvider>
		</React.StrictMode>
	);
};
