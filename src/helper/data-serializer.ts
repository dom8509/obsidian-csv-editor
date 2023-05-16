import { parse, ParseResult, unparse } from 'papaparse';
import { CURRENT_PLUGIN_VERSION } from 'types/constants';
import {
    IBodyCell, IBodyRow, IColumn, IFilterRule, IFooterCell, IFooterRow, IHeaderCell, IHeaderRow,
    ITableState, ITag
} from 'types/table';

import {
    createBodyCell, createBodyRow, createColumn, createFooterCell, createFooterRow,
    createHeaderCell, createHeaderRow
} from './table-helper';

/*
 * Converts TableState Data into a string using papaparse
 *
 * @param   data    Data as TableState object
 *
 * @returns         Data as serializeable string.
 *
 */
export const serializeData = (data: ITableState): string => {
	const serializedData = unparse({
		fields: data.serialization.headerCellValues,
		data: data.serialization.cellValues,
	});

	return serializedData;
};

/*
 * Converts a csv data string into TableState Data using papaparse
 *
 * @params  data    Data as csv string
 *
 * @returns         Data as a TableState Object
 *
 */
export const deserializeData = (
	data: string,
	hasHeader: boolean
): ITableState => {
	const csvData: ParseResult<Record<string, unknown>> = parse(data, {
		header: hasHeader,
		dynamicTyping: true,
	});

	//Create columns
	const columns: IColumn[] = [];
	csvData.meta.fields?.map((column, x) => {
		columns.push(createColumn(x));
	});

	// Create headers
	const headerRows: IHeaderRow[] = [];
	headerRows.push(createHeaderRow());

	const headerCells: IHeaderCell[] = [];
	const headerCellValues: string[] = [];
	csvData?.meta.fields?.forEach((column, x) => {
		const headerCell = createHeaderCell(columns[x].id, headerRows[0].id);
		const value = column || "Column " + (x + 1);
		headerCell.markdown = value;
		headerCells.push(headerCell);
		headerCellValues.push(value);
	});

	// Create body
	const bodyRows: IBodyRow[] = [];
	const bodyCells: IBodyCell[] = [];
	const cellValues: string[][] = [];
	csvData.data.forEach((row, y) => {
		// Add a new row
		bodyRows.push(createBodyRow(y));

		const cellValueRow: string[] = [];
		// Add cells
		csvData?.meta.fields?.forEach((column, x) => {
			const bodyCell = createBodyCell(columns[x].id, bodyRows[y].id);
			const value = (row[column] as string) || "";
			bodyCell.markdown = value;
			bodyCells.push(bodyCell);
			cellValueRow.push(value);
		});
		cellValues.push(cellValueRow);
	});

	// Create footers
	const footerRows: IFooterRow[] = [];
	footerRows.push(createFooterRow());
	footerRows.push(createFooterRow());

	const footerCells: IFooterCell[] = [];

	footerRows.map((row) => {
		columns.map((column) => {
			footerCells.push(createFooterCell(column.id, row.id));
		});
	});

	const tags: ITag[] = [];
	const filterRules: IFilterRule[] = [];

	return {
		model: {
			columns,
			headerRows,
			bodyRows,
			footerRows,
			headerCells,
			bodyCells,
			footerCells,
			tags,
			filterRules,
		},
		serialization: {
			headerCellValues,
			cellValues,
		},
		pluginVersion: CURRENT_PLUGIN_VERSION,
	};
};
