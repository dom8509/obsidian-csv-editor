import React from 'react';

import Cell from './Cell';
import { CsvSheet, CsvSheetProps } from './CsvSheet';
import DataEditor from './DataEditor';
import DataSheet from './DataSheet';
import { renderData, renderValue } from './renderHelpers';
import Row from './Row';
import Sheet from './Sheet';
import ValueViewer from './ValueViewer';

export { DataSheet, Sheet, Row, Cell, DataEditor, ValueViewer, renderValue, renderData };

export function createSheet(props: CsvSheetProps) {
	console.log(props)
	return (
		<React.StrictMode>
			<CsvSheet {...props} />
		</React.StrictMode>
	);
}
