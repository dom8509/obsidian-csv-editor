import { createSheet } from 'components';
import { CsvSheetColumnType, CsvSheetDataType } from 'components/CsvSheet';
import { TextFileView, WorkspaceLeaf } from 'obsidian';
import { parse, ParseResult, unparse } from 'papaparse';
import { createRoot, Root } from 'react-dom/client';

export const VIEW_TYPE_CSV = "csv-view";

export class CsvView extends TextFileView {
	containerEl: HTMLElement;
	// rootEl: Root;
	csvData: ParseResult<Record<string, unknown>> | undefined;

	public get extContentEl(): HTMLElement {
		// @ts-ignore
		return this.contentEl;
	}

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);

		this.handleDataChanged = this.handleDataChanged.bind(this);
	}

	getViewType(): string {
		return VIEW_TYPE_CSV;
	}

	getDisplayText(): string {
		return "CSV View";
	}

	// is called BEFORE the TextView is rendered
	async onOpen() {
	}

	async onClose() {
		this.contentEl.empty();
	}

	getViewData(): string {
		let viewData = "";
		if (this.csvData) {
			if (this.csvData.meta.fields) {
				viewData = unparse({
					fields: this.csvData.meta.fields,
					data: this.csvData.data,
				});
			} else {
				viewData = unparse(this.csvData.data);
			}
		}
		return viewData;
	}

	// is called AFTER the TextView is rendered
	setViewData(data: string, clear: boolean): void {
		if (clear) {
			this.clear();
		}

		const containerEl = this.contentEl.createEl("div");
		containerEl.classList.add("csv-table-wrapper");
		containerEl.setAttribute("id", this.file.basename);
		const rootEl = createRoot(containerEl);		

		this.csvData = parse(data, {
			header: true,
			dynamicTyping: true,
		});

		const tableData: CsvSheetDataType = [];
		const columnData: Array<CsvSheetColumnType> = [];
		if (this.csvData.data.length > 0 && this.csvData.meta.fields) {
			if (this.csvData.meta.fields) {
				this.csvData.meta.fields.forEach((column) => {
					columnData.push({ name: column });
				});
			}

			this.csvData.data.forEach((row) => {
				const dataRow: any = [];
				this.csvData?.meta.fields?.forEach((column) => {
					dataRow.push({ value: row[column] });
				});
				tableData.push(dataRow);
			});
		}
		
		const sheet = createSheet({
			columns: columnData,
			data: tableData,
			onDataChanged: this.handleDataChanged,
		});

		rootEl.render(sheet);
	}

	clear(): void {
		this.contentEl.empty();
		this.csvData = undefined;
	}

	handleDataChanged(changes: Array<any>) {
		console.log("In handleDataChanges");
		if (this.csvData?.meta.fields) {
			for (const change of changes) {
				// determine which column has changed
				const colName = this.csvData?.meta.fields[change.col];
				console.log(
					"old value: ",
					this.csvData.data[change.row][colName]
				);
				console.log("new value: ", change.value);
				this.csvData.data[change.row][colName] = change.value;
			}
			this.requestSave();
		}
	}
}
