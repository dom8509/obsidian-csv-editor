import { Menu } from 'obsidian';
import { useState } from 'react';

export type ContextMenuItemsType = {
	onNewBefore?: any;
	onNewAfter?: any;
	onDelete?: any;
	onCut?: any;
	onCopy?: any;
	onPaste?: any;
	onShowTableData?: any;
	onShowClipboardData?: any;
	onShowSelectableData?: any;
};

export const useContextMenu = () => {
	const [isCut, setCut] = useState(false);
	const [isCopied, setCopied] = useState(false);

	return (event: any, items: ContextMenuItemsType) => {
		console.log("In handleContextMenu");

		const menu = new Menu();

		if (items.onNewBefore) {
			menu.addItem((item) =>
				item
					.setTitle("Create Before")
					.setIcon("list plug")
					.onClick(() => {
						items.onNewBefore();
					})
			);
		}

		if (items.onNewAfter) {
			menu.addItem((item) =>
				item
					.setTitle("Create After")
					.setIcon("list plug")
					.onClick(() => {
						items.onNewAfter();
					})
			);
		}

		if (items.onDelete) {
			menu.addItem((item) =>
				item
					.setTitle("Delete")
					.setIcon("delete")
					.onClick(() => {
						items.onDelete();
					})
			);
		}

		menu.addSeparator();

		if (items.onCut) {
			menu.addItem((item) =>
				item
					.setTitle("Cut")
					.setIcon("scissors")
					.onClick(() => {
						items.onCut();
						setCut(true);
					})
			);
		}
		if (items.onCopy) {
			menu.addItem((item) =>
				item
					.setTitle("Copy")
					.setIcon("clipboard-copy")
					.onClick(() => {
						items.onCopy();
						setCopied(true);
					})
			);
		}
		if (items.onPaste) {
			menu.addItem((item) =>
				item
					.setTitle("Paste")
					.setIcon("clipboard-paste")
					.setDisabled(!isCut && !isCopied)
					.onClick(() => {
						items.onPaste();
						setCut(false);
						setCopied(false);
					})
			);
		}

		menu.addSeparator();

		if (items.onShowTableData) {
			menu.addItem((item) =>
			item
				.setTitle("Show Table Data")
				.setIcon("bug")
				.onClick(() => {
					items.onShowTableData();
				})
		);
		}

		menu.showAtMouseEvent(event);
	};
};
