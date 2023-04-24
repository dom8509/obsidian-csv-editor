import { createSheet } from 'components';
import ColumnHeader from 'components/ColumnHeader';
import { CsvSheetColumnType, CsvSheetDataType } from 'components/CsvSheet';
import { TextFileView, WorkspaceLeaf } from 'obsidian';
import { parse, ParseResult } from 'papaparse';
import { createRoot, Root } from 'react-dom/client';

export const VIEW_TYPE_CSV = "csv-view";

const convertToKey = (str: string) => {
	return str.toLowerCase().split(" ").join("-");
};

export class CsvView extends TextFileView {
	tableContainer: HTMLDivElement | null = null;
	rootContainer: Root | null = null;

	public get extContentEl(): HTMLElement {
		// @ts-ignore
		return this.contentEl;
	}

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);

		// this.tableContainer = document.createElement("div");
		// this.tableContainer.classList.add("csv-table-wrapper");
		// this.tableContainer.setAttribute("id", "werte.csv");
		// this.extContentEl.appendChild(this.tableContainer);

		// this.rootContainer = createRoot(this.tableContainer);
	}

	getViewType(): string {
		return VIEW_TYPE_CSV;
	}

	getDisplayText(): string {
		return "CSV View";
	}

	// is called BEFORE the TextView is rendered
	async onOpen() {
		this.tableContainer = document.createElement("div");
		this.tableContainer.classList.add("csv-table-wrapper");
		this.tableContainer.setAttribute("id", "werte.csv");
		this.extContentEl.appendChild(this.tableContainer);

		this.rootContainer = createRoot(this.tableContainer);
	}

	async onClose() {
		// this.rootContainer?
	}

	getViewData(): string {
		console.log("Method getViewData not implemented.");
		return this.data;
	}

	// is called AFTER the TextView is rendered
	setViewData(data: string, clear: boolean): void {
		if (clear) {
			this.clear();
		}

		const csvData: ParseResult<Record<string, unknown>> = parse(data, {
			header: true,
			dynamicTyping: true,
		});

		const tableData: CsvSheetDataType = [];
		const columnData: Array<CsvSheetColumnType> = [];
		if (csvData.data.length > 0 && csvData.meta.fields) {
			if (csvData.meta.fields) {
				csvData.meta.fields.forEach((column) => {
					columnData.push({ name: column });
				});
			}

			csvData.data.forEach((row, idx) => {
				const dataRow: any = [];
				csvData.meta.fields?.forEach((column) => {
					dataRow.push({ value: row[column] });
				});
				tableData.push(dataRow);
			});
		}

		const sheet = createSheet({
			columns: columnData,
			data: tableData,
		});
		this.rootContainer?.render(sheet);
	}

	clear(): void {}
}
