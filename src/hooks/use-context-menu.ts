import { Menu, Notice } from 'obsidian';
import { useState } from 'react';

export const useContextMenu = () => {
	const [isCut, setCut] = useState(false);
	const [isCopied, setCopied] = useState(false);

	return (event: any) => {
		const menu = new Menu();

		menu.addItem((item) =>
			item
				.setTitle("Cut")
				.setIcon("scissors")
				.onClick(() => {
					new Notice("Cut");
					setCut(true);
				})
		);
		menu.addItem((item) =>
			item
				.setTitle("Copy")
				.setIcon("clipboard-copy")
				.onClick(() => {
					new Notice("Copied");
					setCopied(true);
				})
		);
		menu.addItem((item) =>
			item
				.setTitle("Paste")
				.setIcon("clipboard-paste")
				.setDisabled(!isCut && !isCopied)
				.onClick(() => {
					new Notice("Pasted");
					setCut(false);
					setCopied(false);
				})
		);

		menu.showAtMouseEvent(event);
	};
};
