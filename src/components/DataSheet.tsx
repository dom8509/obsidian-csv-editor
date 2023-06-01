import EditableProvider from 'context/EditableContext';
import { usePlugin } from 'context/PluginContext';
import { SelectedCellType, useSelectable } from 'context/SelectableContext';
import { useTableDispatch } from 'context/TableContext';
import { copySelectedData } from 'data/cell-state-operations';
import { clipboardAddCopy, clipboardAddCut } from 'data/clipboard-operations';
import { ClipboardOperationType, useClipboard } from 'hooks/use-clipboard';
import { useContextMenu } from 'hooks/use-context-menu';
import { Notice } from 'obsidian';
import React from 'react';

import BodyRows from './BodyRows';
import HeaderRow from './HeaderRow';

const DataSheet = () => {
	const selectable = useSelectable();
	const [clipboard, dispatchClipboard] = useClipboard();
	const dispatchTable = useTableDispatch();

	const handleCut = (start: SelectedCellType, end: SelectedCellType) => {
		const isSelecting =
			selectable.isSelectingCells ||
			selectable.isSelectingColumns ||
			selectable.isSelectingRows;

		console.log("isSelecting: ");
		console.log(isSelecting);
		if (isSelecting) {
			new Notice("Selecting");
			if (selectable.start && selectable.end) {
				dispatchClipboard(
					clipboardAddCut(selectable.start, selectable.end)
				);
			}
		}
		new Notice("Cut");
	};

	const handleCopy = (start: SelectedCellType, end: SelectedCellType) => {
		const isSelecting =
			selectable.isSelectingCells ||
			selectable.isSelectingColumns ||
			selectable.isSelectingRows;

		console.log("isSelecting: ");
		console.log(isSelecting);
		if (isSelecting) {
			new Notice("Selecting");
			if (selectable.start && selectable.end) {
				dispatchClipboard(
					clipboardAddCopy(selectable.start, selectable.end)
				);
			}
		}
		new Notice("Copied");
	};

	const handlePaste = (cell: SelectedCellType) => {
		console.log("Clipboard:");
		console.log(clipboard);

		if (clipboard.start && clipboard.end && selectable.start) {
			if (clipboard.operation === ClipboardOperationType.Cut) {
				dispatchTable(
					copySelectedData(
						clipboard.start,
						clipboard.end,
						selectable.start
					)
				);
			} else {
				console.warn(
					"Operation " +
						clipboard.operation +
						" not permitted on paste!"
				);
			}
		} else {
			console.warn("Clipboard empty or no cell selected during paste!");
		}
		new Notice("Pasted");
	};

	const handleContextMenu = useContextMenu(
		handleCut,
		handleCopy,
		handlePaste
	);

	const plugin = usePlugin();
	plugin.registerCutCallback(handleCut);
	plugin.registerCopyCallback(handleCopy);
	plugin.registerPasteCallback(handlePaste);

	return (
		<EditableProvider>
			<span
				className="data-sheet-container"
				onContextMenu={handleContextMenu}
			>
				<table className="data-sheet">
					<tbody>
						{/* header row */}
						<HeaderRow />
						<BodyRows />
					</tbody>
				</table>
			</span>
		</EditableProvider>
	);
};

export default DataSheet;
