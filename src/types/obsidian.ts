export interface IObsidianCsvView {
	registerCutCallback(cb: any): void;
	registerCopyCallback(cb: any): void;
    registerPasteCallback(cb: any): void;
}
