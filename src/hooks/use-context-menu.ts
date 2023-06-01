import { Menu } from 'obsidian';
import { useState } from 'react';

export const useContextMenu = (
	handleCut: any,
	handleCopy: any,
	handlePaste: any
) => {
	const [isCut, setCut] = useState(false);
	const [isCopied, setCopied] = useState(false);

	return (event: any) => {
		console.log("In handleContextMenu");

		const menu = new Menu();

		menu.addItem((item) =>
			item
				.setTitle("Cut")
				.setIcon("scissors")
				.onClick(() => {
					handleCut();
					setCut(true);
				})
		);
		menu.addItem((item) =>
			item
				.setTitle("Copy")
				.setIcon("clipboard-copy")
				.onClick(() => {
					handleCopy();
					setCopied(true);
				})
		);
		menu.addItem((item) =>
			item
				.setTitle("Paste")
				.setIcon("clipboard-paste")
				.setDisabled(!isCut && !isCopied)
				.onClick(() => {
					handlePaste();
					setCut(false);
					setCopied(false);
				})
		);

		menu.showAtMouseEvent(event);
	};
};
