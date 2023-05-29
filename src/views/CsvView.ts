import { createSheet } from 'components';
import { deserializeData, serializeData } from 'helper/data-serializer';
import CsvTablePlugin from 'main';
import { TextFileView, WorkspaceLeaf } from 'obsidian';
import { createRoot } from 'react-dom/client';
import { ISerializeableTableModel } from 'types/table';

export const VIEW_TYPE_CSV = "csv-view";

export class CsvView extends TextFileView {
	containerEl: HTMLElement;
	data: string;
	plugin: CsvTablePlugin;

	public get extContentEl(): HTMLElement {
		return this.contentEl;
	}

	constructor(leaf: WorkspaceLeaf, plugin: CsvTablePlugin) {
		super(leaf);

		this.plugin = plugin;
		console.log(this.plugin);

		this.handleChange = this.handleChange.bind(this);
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
		this.addAction("arrow-right", "Redo", this.markdownAction.bind(this));
		this.addAction("arrow-left", "Undo", this.markdownAction.bind(this));
		this.addAction(
			"clipboard-paste",
			"Paste",
			this.markdownAction.bind(this)
		);
		this.addAction(
			"clipboard-copy",
			"Copy",
			this.markdownAction.bind(this)
		);
		this.addAction("scissors", "Cut", this.markdownAction.bind(this));
	}

	getViewData(): string {
		console.log("DEBUG: getViewData called");
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

		const tableData = deserializeData(data, true);
		const sheet = createSheet(tableData, this.handleChange);

		rootEl.render(sheet);
	}

	clear(): void {
		this.contentEl.empty();
	}

	handleChange(data: ISerializeableTableModel) {
		console.log("DEBUG: handleChange called");
		this.data = serializeData(data);
		this.requestSave();
	}

	markdownAction() {
		// this.plugin.databaseFileModes[this.leaf.id || this.file.path] =
		//     InputType.MARKDOWN;
		this.plugin.setMarkdownView(this.leaf);
	}
}
