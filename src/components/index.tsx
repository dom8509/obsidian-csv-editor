import './react-datasheet.css';

import SelectProvider from 'context/SelectContext';
import TableProvider from 'context/TableContext';
import React from 'react';
import { ITableState } from 'types/table';

import DataSheet from './DataSheet';

export const createSheet = (data: ITableState, onChange: any) => {
	return (
		<React.StrictMode>
			<TableProvider onChange={onChange} initialState={data}>
				<SelectProvider>
					<DataSheet />
				</SelectProvider>
			</TableProvider>
		</React.StrictMode>
	);
};
