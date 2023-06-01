import { Color } from './colors';

export enum SortDir {
	ASC = "asc",
	DESC = "desc",
	NONE = "default",
}

export enum OverflowType {
	WRAP = "wrap",
	NOWRAP = "nowrap",
	CLIP = "clip",
}

export enum CellType {
	TEXT = "text",
	NUMBER = "number",
	CURRENCY = "currency",
	TAG = "tag",
	MULTI_TAG = "multi-tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	CREATION_TIME = "creation-time",
	LAST_EDITED_TIME = "last-edited-time",
}

export enum FilterType {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

export enum DateFormat {
	MM_DD_YYYY = "mm/dd/yyyy",
	DD_MM_YYYY = "dd/mm/yyyy",
	YYYY_MM_DD = "yyyy/mm/dd",
	FULL = "full",
	RELATIVE = "relative",
}

export enum CurrencyType {
	UNITED_STATES = "USD",
	CANADA = "CAD",
	SINGAPORE = "SGB",
	EUROPE = "EUR",
	SWEDEN = "SEK",
	DENMARK = "DKK",
	NORWAY = "NOK",
	ICELAND = "ISK",
	POUND = "GBP",
	RUSSIA = "RUB",
	AUSTRALIA = "AUD",
	JAPAN = "JPY",
	INDIA = "INR",
	CHINA = "CNY",
	BRAZIL = "BRL",
	COLOMBIA = "COP",
	MEXICO = "MXN",
	ARGENTINA = "ARS",
}

//TOOD
//Simplify the structure of the table
//TODO change
export enum GeneralFunctionType {
	NONE = "none",
	COUNT_ALL = "count_all",
	COUNT_VALUES = "count_values",
	COUNT_UNIQUE = "count_unique",
	COUNT_EMPTY = "count_empty",
	COUNT_NOT_EMPTY = "count_not_empty",
	PERCENT_EMPTY = "percent_empty",
	PERCENT_NOT_EMPTY = "percent_not_empty",
}

export enum NumberFunctionType {
	SUM = "sum",
	AVG = "avg",
	MIN = "min",
	MAX = "max",
	MEDIAN = "median",
	RANGE = "range",
}

export type FunctionType = GeneralFunctionType | NumberFunctionType;

export interface IColumn {
	id: string;
	index: number; // Defines at which index the column appears in the table
	origIndex: number; // The original index of the column in the csv -> not altered by sort or filters
	sortDir: SortDir;
	width: string;
	type: CellType;
	isVisible: boolean;
	dateFormat: DateFormat;
	currencyType: CurrencyType;
	overflow: OverflowType;
}

export interface IFilterRule {
	id: string;
	columnId: string;
	type: FilterType;
	text: string;
	tagIds: string[];
	isEnabled: boolean;
}

interface IRow {
	id: string;
}

export interface IBodyRow extends IRow {
	index: number; // Defines at which index the row appears in the table
	origIndex: number; // The original index of the row in the csv -> not altered by sort or filters
	menuCellId: string;
	creationTime: number;
	lastEditedTime: number;
}

export type IHeaderRow = IRow;
export type IFooterRow = IRow;

interface ICell {
	id: string;
	columnId: string;
	rowId: string;
}

export interface IHeaderCell extends ICell {
	markdown: string;
}

export interface IBodyCell extends ICell {
	dateTime: number | null;
	markdown: string;
}

export interface IFooterCell extends ICell {
	functionType: FunctionType;
}

export interface ITag {
	id: string;
	markdown: string;
	color: Color;
	columnId: string;
	cellIds: string[];
}

// Composing types
export interface ITableModel {
	columns: IColumn[];
	headerRows: IHeaderRow[];
	bodyRows: IBodyRow[];
	footerRows: IFooterRow[];
	headerCells: IHeaderCell[];
	bodyCells: IBodyCell[];
	footerCells: IFooterCell[];
	tags: ITag[];
	filterRules: IFilterRule[];
}

export interface ISerializeableTableModel {
	headerCellValues: string[];
	cellValues: string[][];
}

export interface IHashIndexModel {
	rowPositions: Map<string, number>;
	columnPositions: Map<string, number>;
}

export interface IBaseTableState {
	pluginVersion: number;
}

export interface ITableState extends IBaseTableState {
	model: ITableModel;
	serialization: ISerializeableTableModel;
	hashIndizes: IHashIndexModel;
}

export type CellPositionType = {
	column: number;
	row: number;
}

export type CellRangeType = {
	start: CellPositionType;
	end: CellPositionType;
}