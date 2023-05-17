import { createSheet } from 'components';
import { deserializeData } from 'helper/data-serializer';
import CsvTablePlugin from 'main';
import { Menu, Notice, TextFileView, WorkspaceLeaf } from 'obsidian';
import { ParseResult, unparse } from 'papaparse';
import { createRoot } from 'react-dom/client';

export const VIEW_TYPE_CSV = "csv-view";

export class CsvView extends TextFileView {
	containerEl: HTMLElement;
	// rootEl: Root;
	csvData: ParseResult<Record<string, unknown>> | undefined;
	data: string;
	plugin: CsvTablePlugin;

	public get extContentEl(): HTMLElement {
		return this.contentEl;
	}

	constructor(leaf: WorkspaceLeaf, plugin: CsvTablePlugin) {
		super(leaf);

		this.plugin = plugin;
		console.log(this.plugin);

		this.handleDataChanged = this.handleDataChanged.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
	}

	getViewType(): string {
		return VIEW_TYPE_CSV;
	}

	getDisplayText(): string {
		return "CSV View";
	}

	// is called BEFORE the TextView is rendered
	// async onOpen() {}

	// async onClose() {
	// 	this.contentEl.empty();
	// }

	// is called when the plugin is loaded or updated
	async onload() {
		// Open as markdown action
		this.addAction(
			"document",
			"Open as Markdown",
			this.markdownAction.bind(this)
		);
	}

	getViewData(): string {
		// let viewData = "";
		// if (this.csvData) {
		// 	if (this.csvData.meta.fields) {
		// 		viewData = unparse({
		// 			fields: this.csvData.meta.fields,
		// 			data: this.csvData.data,
		// 		});
		// 	} else {
		// 		viewData = unparse(this.csvData.data);
		// 	}
		// }
		return this.data;
	}

	// is called AFTER the TextView is rendered
	setViewData(data: string, clear: boolean): void {
		if (clear) {
			this.clear();
		}
		this.data = data;

		const containerEl = this.contentEl.createEl("div");
		containerEl.classList.add("csv-table-wrapper");
		containerEl.setAttribute("id", this.file.basename);
		const rootEl = createRoot(containerEl);

		// this.csvData = parse(data, {
		// 	header: true,
		// 	dynamicTyping: true,
		// });

		// const tableData: CsvSheetDataType = [];
		// const columnData: Array<CsvSheetColumnType> = [];
		// if (this.csvData.data.length > 0 && this.csvData.meta.fields) {
		// 	if (this.csvData.meta.fields) {
		// 		this.csvData.meta.fields.forEach((column) => {
		// 			columnData.push({ name: column });
		// 		});
		// 	}

		// 	this.csvData.data.forEach((row) => {
		// 		const dataRow: any = [];
		// 		this.csvData?.meta.fields?.forEach((column) => {
		// 			dataRow.push({ value: row[column] });
		// 		});
		// 		tableData.push(dataRow);
		// 	});
		// }

		const tableData = deserializeData(data, true);
		const sheet = createSheet(tableData, this.handleDataChanged);

		rootEl.render(sheet);
	}

	clear(): void {
		this.contentEl.empty();
		this.csvData = undefined;
	}

	handleDataChanged(changes: Array<any>) {
		if (this.csvData?.meta.fields) {
			for (const change of changes) {
				if (change.row >= this.csvData.data.length) {
					const newRow: Record<string, unknown> =
						this.csvData.meta.fields
							.map((fieldName) => ({ [fieldName]: null }))
							.reduce((acc, val) => ({ ...acc, ...val }), {});

					//@ts-ignore: Argument of type 'any[]' is not assignable to parameter of type 'Record<string, unknown>'.
					this.csvData.data.push(newRow);
				} else if (change.col > this.csvData.meta.fields.length) {
					this.csvData.meta.fields.push(
						"Neue Spalte " + (this.csvData.meta.fields.length + 1)
					);
				}

				// determine which column has changed
				const colName = this.csvData?.meta.fields[change.col];
				this.csvData.data[change.row][colName] = change.value;
			}
			this.requestSave();
		}
	}

	handleContextMenu(event: any, cell: any, i: number, j: number) {
		const menu = new Menu();

		menu.addItem((item) =>
			item
				.setTitle("Copy")
				.setIcon("documents")
				.onClick(() => {
					new Notice("Copied");
				})
		);

		menu.addItem((item) =>
			item
				.setTitle("Paste")
				.setIcon("paste")
				.onClick(() => {
					new Notice("Pasted");
				})
		);

		menu.showAtMouseEvent(event);
	}

	markdownAction() {
		// this.plugin.databaseFileModes[this.leaf.id || this.file.path] =
		//     InputType.MARKDOWN;
		this.plugin.setMarkdownView(this.leaf);
	}
}
