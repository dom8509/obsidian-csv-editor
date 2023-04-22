import React from 'react';

import Cell from './Cell';
import { CsvSheet, CsvSheetData, CsvSheetProps } from './CsvSheet';
import DataEditor from './DataEditor';
import DataSheet from './DataSheet';
import { renderData, renderValue } from './renderHelpers';
import Row from './Row';
import Sheet from './Sheet';
import ValueViewer from './ValueViewer';

export { DataSheet, Sheet, Row, Cell, DataEditor, ValueViewer, renderValue, renderData };

export function createSheet(data: CsvSheetData) {
	const test: CsvSheetProps = {
		data: data,
	}
	return (
		<React.StrictMode>
			<CsvSheet {...test} />
		</React.StrictMode>
	);
}
