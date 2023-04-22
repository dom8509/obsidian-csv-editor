import { createSheet } from 'components';
import { CsvSheetColumnType, CsvSheetDataType } from 'components/CsvSheet';
import { TextFileView, WorkspaceLeaf } from 'obsidian';
import { parse, ParseResult } from 'papaparse';
import { createRoot, Root } from 'react-dom/client';

export const VIEW_TYPE_CSV = "csv-view";

const convertToKey = (str: string) => {
	return str.toLowerCase().split(" ").join("-");
}

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
		// console.log("SetViewData");
		this.data = data;
		// console.log(clear);
		// console.log(data);
		const csvData: ParseResult<Record<string, unknown>> = parse(data, {
			header: true,
			dynamicTyping: true,
		});

		// console.log(data);
		// const tableColumns: Array<CsvSheetColumnType> = [];
		const tableData: CsvSheetDataType = [];
		if (csvData.data.length > 0 && csvData.meta.fields) {
			if (csvData.meta.fields) {

				const dataRow: any = [];
				dataRow.push({ value: "" , readOnly: true });
				csvData.meta.fields.forEach((column) => {
					// console.log("Columns: ");
					// console.log(column);
					dataRow.push({ value: column, readOnly: true });
					
					// tableColumns.push({ key: convertToKey(column), name: column, width: 20 });
				});

				tableData.push(dataRow);
			} else {
				console.log("")
			}


			// console.log("tableColumns");
			// console.log(tableColumns);

			csvData.data.forEach((row, idx) => {
				// console.log("Row:");
				// console.log(row);
				const dataRow: any = [];
				dataRow.push({ value: idx+1, readOnly: true });
				csvData.meta.fields?.forEach((column) => {
					dataRow.push({ value: row[column] });
				});
				tableData.push(dataRow);
			});

			const sheet = createSheet({
				data: tableData,
			});
			this.rootContainer?.render(sheet);
		}
	}

	clear(): void {
		console.log("Method clear not implemented.");
	}
}
