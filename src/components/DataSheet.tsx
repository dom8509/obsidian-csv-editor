import EditableProvider from 'context/EditableContext';
import { usePlugin } from 'context/PluginContext';
import { useSelectable } from 'context/SelectableContext';
import { useTable, useTableDispatch } from 'context/TableContext';
import { copySelectedData } from 'data/cell-state-operations';
import { clipboardAddCopy, clipboardAddCut } from 'data/clipboard-operations';
import { addColumn, deleteColumns } from 'data/column-state-operations';
import { addRow, deleteRows } from 'data/row-state-operations';
import { ClipboardOperationType, useClipboard } from 'hooks/use-clipboard';
import { ContextMenuItemsType, useContextMenu } from 'hooks/use-context-menu';
import { Notice } from 'obsidian';
import React from 'react';

import BodyRows from './BodyRows';
import HeaderRow from './HeaderRow';

const DataSheet = () => {
	const table = useTable();
	const selectable = useSelectable();
	const [clipboard, dispatchClipboard] = useClipboard();
	const dispatchTable = useTableDispatch();

	const handleCut = () => {
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

	const handleCopy = () => {
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

	const handlePaste = () => {
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

	const handleNewBefore = () => {
		console.log("In handleNewBefore");
		if (selectable.start && selectable.end) {
			if (selectable.isSelectingColumns) {
				dispatchTable(addColumn(selectable.start.column));
			} else if (selectable.isSelectingRows) {
				dispatchTable(addRow(selectable.start.row));
			}
		}
	};

	const handleNewAfter = () => {
		console.log("In handleNewAfter");
		if (selectable.start && selectable.end) {
			if (selectable.isSelectingColumns) {
				dispatchTable(addColumn(selectable.start.column + 1));
			} else if (selectable.isSelectingRows) {
				dispatchTable(addRow(selectable.start.row + 1));
			}
		}
	};

	const handleDelete = () => {
		console.log("In handle delete");
		if (selectable.start && selectable.end) {
			if (selectable.isSelectingColumns) {
				dispatchTable(
					deleteColumns(
						selectable.start.column,
						selectable.end.column
					)
				);
			} else if (selectable.isSelectingRows) {
				dispatchTable(
					deleteRows(selectable.start.row, selectable.end.row)
				);
			}
		}
	};

	const handleShowTableData = () => {
		console.log(table);
	};

	const contextMenu = useContextMenu();

	const handleContextMenu = (event: any) => {
		let operations: ContextMenuItemsType = {
			onCut: handleCopy,
			onCopy: handleCopy,
			onPaste: handlePaste,
			onShowTableData: handleShowTableData,
		};

		if (selectable.isSelectingCells) {
			contextMenu(event, operations);
		} else if (
			selectable.isSelectingColumns ||
			selectable.isSelectingRows
		) {
			operations = {
				...operations,
				onNewBefore: handleNewBefore,
				onNewAfter: handleNewAfter,
				onDelete: handleDelete,
			};
			contextMenu(event, operations);
		}
	};

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
				<table className="data-sheet-table">
					<thead>
						<HeaderRow />
					</thead>
					<tbody>
						<BodyRows />
					</tbody>
				</table>
			</span>
		</EditableProvider>
	);
};

export default DataSheet;
