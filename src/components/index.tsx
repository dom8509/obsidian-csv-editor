import './react-datasheet.css';

import EditableProvider from 'context/EditableContext';
import SelectableProvider from 'context/SelectableContext';
import TableProvider from 'context/TableContext';
import React from 'react';
import { ITableState } from 'types/table';

import DataSheet from './DataSheet';

export const createSheet = (data: ITableState, onChange: any) => {
	return (
		<React.StrictMode>
			<TableProvider onChange={onChange} initialState={data}>
				<SelectableProvider>
					<EditableProvider>
						<DataSheet />
					</EditableProvider>
				</SelectableProvider>
			</TableProvider>
		</React.StrictMode>
	);
};
