import './react-datasheet.css';

import PluginProvider from 'context/PluginContext';
import SelectableProvider from 'context/SelectableContext';
import TableProvider from 'context/TableContext';
import React from 'react';
import { IObsidianCsvView } from 'types/obsidian';
import { ITableState } from 'types/table';

import DataSheet from './DataSheet';

export const createSheet = (
	data: ITableState,
	plugin: IObsidianCsvView,
	onChange: any
) => {
	return (
		<React.StrictMode>
			<PluginProvider plugin={plugin}>
				<TableProvider onChange={onChange} initialState={data}>
					<SelectableProvider>
						<DataSheet />
					</SelectableProvider>
				</TableProvider>
			</PluginProvider>
		</React.StrictMode>
	);
};
