import { ItemView, TextFileView, WorkspaceLeaf } from 'obsidian';
import * as papa from 'papaparse';

export const VIEW_TYPE_CSV = "csv-view";

export class CsvView extends TextFileView {
	loadingBar: HTMLElement;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_CSV;
	}

	getDisplayText(): string {
		return "CSV View";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h4", { text: "Example view" });
	}

	async onClose() {
		// Nothing to clean up.
	}

	getViewData(): string {
		throw new Error("Method not implemented.");
	}

	setViewData(data: string, clear: boolean): void {
		console.log("SetViewData");
		console.log(papa.parse(data));
	}

	clear(): void {
		throw new Error("Method not implemented.");
	}
}
