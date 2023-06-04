import { createSheet } from 'components';
import { deserializeData, serializeData } from 'helper/data-serializer';
import CsvTablePlugin from 'main';
import { Platform, TextFileView, WorkspaceLeaf } from 'obsidian';
import { createRoot } from 'react-dom/client';
import { IObsidianCsvView } from 'types/obsidian';
import { ISerializeableTableModel } from 'types/table';

export const VIEW_TYPE_CSV = "csv-view";

export class CsvView extends TextFileView implements IObsidianCsvView {
	containerEl: HTMLElement;
	data: string;
	plugin: CsvTablePlugin;
	cutCallback: any = undefined;
	copyCallback: any = undefined;
	pasteCallback: any = undefined;

	public get extContentEl(): HTMLElement {
		return this.contentEl;
	}

	constructor(leaf: WorkspaceLeaf, plugin: CsvTablePlugin) {
		super(leaf);

		this.plugin = plugin;
		// console.log(this.plugin);

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

		if (Platform.isDesktop) {
			this.addAction(
				"arrow-right",
				"Redo",
				this.markdownAction.bind(this)
			);
			this.addAction(
				"arrow-left",
				"Undo",
				this.markdownAction.bind(this)
			);
			this.addAction(
				"clipboard-paste",
				"Paste",
				this.handlePasteCallback.bind(this)
			);
			this.addAction(
				"clipboard-copy",
				"Copy",
				this.handleCopyCallback.bind(this)
			);
			this.addAction(
				"scissors",
				"Cut",
				this.handleCutCallback.bind(this)
			);
		}
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
		const sheet = createSheet(tableData, this, this.handleChange);

		rootEl.render(sheet);
	}

	clear(): void {
		this.contentEl.empty();
	}

	markdownAction() {
		// this.plugin.databaseFileModes[this.leaf.id || this.file.path] =
		//     InputType.MARKDOWN;
		this.plugin.setMarkdownView(this.leaf);
	}

	handleChange(data: ISerializeableTableModel) {
		console.debug("DEBUG: CsvView::handleChange called");
		this.data = serializeData(data);
		this.requestSave();
	}

	handleCutCallback(): void {
		if (this.cutCallback) {
			this.cutCallback();
		}
	}

	handleCopyCallback(): void {
		if (this.copyCallback) {
			this.copyCallback();
		}
	}

	handlePasteCallback(): void {
		if (this.pasteCallback) {
			this.pasteCallback();
		}
	}

	registerCutCallback(cb: any): void {
		this.cutCallback = cb;
		console.debug("DEBUG: CsvView::registerCutCallback called");
	}

	registerCopyCallback(cb: any): void {
		this.copyCallback = cb;
		console.debug("DEBUG: CsvView::registerCopyCallback called");
	}

	registerPasteCallback(cb: any): void {
		this.pasteCallback = cb;
		console.debug("DEBUG: CsvView::registerPasteCallback called");
	}
}
