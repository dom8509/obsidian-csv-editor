import { CHECKBOX_MARKDOWN_UNCHECKED } from 'types/constants';
import {
    CellType, CurrencyType, DateFormat, FilterType, GeneralFunctionType, IBodyCell, IBodyRow,
    IColumn, IFilterRule, IFooterCell, IFooterRow, IHeaderCell, IHeaderRow, ITag, SortDir
} from 'types/table';
import { v4 as uuidv4 } from 'uuid';

import { randomColor } from './color-helper';

// export const createInitialTable = (): TableState => {
// 	const columns: Column[] = [];
// 	const headerRows: HeaderRow[] = [];
// 	const bodyRows: BodyRow[] = [];
// 	const footerRows: FooterRow[] = [];
// 	const headerCells: HeaderCell[] = [];
// 	const bodyCells: BodyCell[] = [];
// 	const footerCells: FooterCell[] = [];
// 	const tags: Tag[] = [];
// 	const filterRules: FilterRule[] = [];

// 	return {
// 		model: {
// 			columns,
// 			headerRows,
// 			bodyRows,
// 			footerRows,
// 			headerCells,
// 			bodyCells,
// 			footerCells,
// 			tags,
// 			filterRules,
// 		},
// 		pluginVersion: 0,
// 	};
// };

export const createColumn = (currentBodyColumnCount: number): IColumn => {
	return {
		id: uuidv4(),
		index: currentBodyColumnCount,
		origIndex: currentBodyColumnCount,
		sortDir: SortDir.NONE,
		isVisible: true,
		width: "140px",
		type: CellType.TEXT,
		currencyType: CurrencyType.UNITED_STATES,
		dateFormat: DateFormat.MM_DD_YYYY,
		shouldWrapOverflow: false,
	};
};

export const createHeaderRow = (): IHeaderRow => {
	return {
		id: uuidv4(),
	};
};

export const createFooterRow = (): IFooterRow => {
	return {
		id: uuidv4(),
	};
};

export const createBodyRow = (currentBodyRowCount: number): IBodyRow => {
	const currentTime = Date.now();
	return {
		id: uuidv4(),
		index: currentBodyRowCount,
		origIndex: currentBodyRowCount,
		menuCellId: uuidv4(),
		creationTime: currentTime,
		lastEditedTime: currentTime,
	};
};

export const createHeaderCell = (
	columnId: string,
	rowId: string
): IHeaderCell => {
	return {
		id: uuidv4(),
		columnId,
		rowId,
		markdown: "New Column",
	};
};

export const createBodyCell = (
	columnId: string,
	rowId: string,
	cellType?: CellType
): IBodyCell => {
	return {
		id: uuidv4(),
		columnId,
		rowId,
		dateTime: null,
		markdown:
			cellType === CellType.CHECKBOX ? CHECKBOX_MARKDOWN_UNCHECKED : "",
	};
};

export const createFilterRule = (columnId: string): IFilterRule => {
	return {
		id: uuidv4(),
		columnId,
		type: FilterType.IS,
		text: "",
		tagIds: [],
		isEnabled: true,
	};
};

export const createFooterCell = (
	columnId: string,
	rowId: string
): IFooterCell => {
	return {
		id: uuidv4(),
		columnId,
		rowId,
		functionType: GeneralFunctionType.NONE,
	};
};

export const createTag = (
	columnId: string,
	cellId: string,
	markdown: string,
	color = randomColor()
): ITag => {
	return {
		id: uuidv4(),
		columnId,
		markdown: markdown,
		color,
		cellIds: [cellId],
	};
};
