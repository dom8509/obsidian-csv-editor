
import { createSheet } from 'components';
import { TextFileView, WorkspaceLeaf } from 'obsidian';
import { parse, ParseResult } from 'papaparse';
import { createRoot, Root } from 'react-dom/client';

export const VIEW_TYPE_CSV = "csv-view";

export class CsvView extends TextFileView {
	tableContainer: HTMLDivElement | null = null;
	rootContainer: Root | null = null;

	public get extContentEl(): HTMLElement {
		// @ts-ignore
		return this.contentEl;
	}

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);

		this.tableContainer = document.createElement("div");
		this.tableContainer.classList.add("csv-table-wrapper");
		this.tableContainer.setAttribute("id", "werte.csv");
		this.extContentEl.appendChild(this.tableContainer);

		this.rootContainer = createRoot(this.tableContainer);
	}

	getViewType(): string {
		return VIEW_TYPE_CSV;
	}

	getDisplayText(): string {
		return "CSV View";
	}

	// async onOpen() {
	// 	const container = this.containerEl.children[1];
	// 	container.empty();
	// 	container.createEl("h4", { text: "Example view" });
	// }

	// async onClose() {
	// 	// Nothing to clean up.
	// }

	getViewData(): string {
		console.log("Method getViewData not implemented.");
		return this.data;
	}

	setViewData(data: string, clear: boolean): void {
		console.log("SetViewData");
		this.data = data;
		console.log(clear);
		console.log(data);
		const csvData: ParseResult<Record<string, unknown>> = parse(data, {
			header: true,
			dynamicTyping: true,
		});

		console.log(data);
		const columns: Array<SheetColumn> = [];
		let tableData: Array<SheetRow> = [];
		if (csvData.data.length > 0 && csvData.meta.fields) {
			// if (csvData.meta.fields) {
			// 	csvData.meta.fields.forEach((column) => {
			// 		columns.push({ key: column, name: column, width: 20 });
			// 	});
			// }

			csvData.meta.fields.forEach((column) => {
				columns.push({ label: column, width: 120 });
			});

			csvData.data.forEach((row, idx) => {
				console.log("Row:");
				console.log(row);
				const dataRow = [];
				dataRow.push({ readOnly: true, value: idx });
				csvData.meta.fields?.forEach((column) => {
					dataRow.push({value: row[column]});
				});
				tableData.push(dataRow);
			});

			// console.log("columns");
			// console.log(columns);
			// console.log("columns");
			// console.log(tableData);

			// const table = createTable(columns, tableData);
			// this.rootContainer?.render(table);
			const sheet = createSheet(columns, tableData);
			this.rootContainer?.render(sheet);
			// console.log(table);

			// const headerData: Record<string, unknown> = csvData.data[0];
			// for (const headerEntry of headerData) {
			// 	columns.push({
			// 		key: this.convertToColumsKey(headerEntry),
			// 		name: headerEntry,
			// 	}: Array<string, string>);
			// }
			// console.log("test");
			// console.log(csvData.data.length);
			// console.log(csvData.meta.fields);
			// console.log(csvData);
		}
	}

	clear(): void {
		console.log("Method clear not implemented.");
	}
}
