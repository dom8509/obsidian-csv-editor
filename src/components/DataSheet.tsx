import React from 'react';

import Cell from './Cell';
import { CellShapeType } from './CellShape';
import ColumnHeader, { COLUMN_HEADER_IDX } from './ColumnHeader';
import DataCell from './DataCell';
import DataEditor from './DataEditor';
import {
    BACKSPACE_KEY, DELETE_KEY, DOWN_KEY, ENTER_KEY, ESCAPE_KEY, LEFT_KEY, RIGHT_KEY, TAB_KEY, UP_KEY
} from './keys';
import Row from './Row';
import RowHeader, { ROW_HEADER_IDX } from './RowHeader';
import Sheet from './Sheet';
import ValueViewer from './ValueViewer';

type FunctionType = (...args: any[]) => any;
type OverflowType = "wrap" | "nowrap" | "clip";
type SelectedCellType = {
	i: number; // Row index
	j: number; // Colum index
};
type SelectedRangeType = {
	start: SelectedCellType;
	end: SelectedCellType;
};

export interface DataSheetProps {
	data: Array<Array<any>>;
	columns?: Array<any>;
	className?: string;
	disablePageClick?: boolean;
	overflow?: OverflowType;
	onChange?: FunctionType;
	onPaste?: FunctionType;
	onCellsChanged?: FunctionType;
	onContextMenu?: FunctionType;
	onSelect?: FunctionType;
	isCellNavigable?: FunctionType;
	selected?: SelectedRangeType;
	valueRenderer: FunctionType;
	dataRenderer?: FunctionType;
	sheetRenderer: FunctionType;
	rowRenderer: FunctionType;
	cellRenderer: FunctionType;
	valueViewer?: FunctionType;
	dataEditor?: FunctionType;
	parsePaste?: FunctionType;
	attributesRenderer?: FunctionType;
	keyFn?: FunctionType;
	handleCopy?: FunctionType;
	editModeChanged?: FunctionType;
}

interface DataSheetState {
	start?: SelectedCellType;
	end?: SelectedCellType;
	selecting: boolean; // indicates if click and hold is active
	forceEdit: boolean;
	editing?: SelectedCellType;
	clear?: SelectedCellType;
}

const isEmpty = (obj: SelectedCellType | undefined) =>
	!obj || Object.keys(obj).length === 0;

const range = (start: number, end: number) => {
	const array = [];
	const inc = end - start > 0;
	for (let i = start; inc ? i <= end : i >= end; inc ? i++ : i--) {
		inc ? array.push(i) : array.unshift(i);
	}
	return array;
};

const defaultParsePaste = (str: string) => {
	return str.split(/\r\n|\n|\r/).map((row) => row.split("\t"));
};

export default class DataSheet extends React.Component<
	DataSheetProps,
	DataSheetState
> {
	dgDom: HTMLSpanElement;
	defaultState: DataSheetState;

	static defaultProps = {
		sheetRenderer: Sheet,
		rowRenderer: Row,
		cellRenderer: Cell,
		valueViewer: ValueViewer,
		dataEditor: DataEditor,
	};

	constructor(props: DataSheetProps) {
		super(props);

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onDoubleClick = this.onDoubleClick.bind(this);
		this.onContextMenu = this.onContextMenu.bind(this);
		this.handleNavigate = this.handleNavigate.bind(this);
		this.handleKey = this.handleKey.bind(this).bind(this);
		this.handleCut = this.handleCut.bind(this);
		this.handleCopy = this.handleCopy.bind(this);
		this.handlePaste = this.handlePaste.bind(this);
		this.onColumnHeaderClick = this.onColumnHeaderClick.bind(this);
		this.onRowHeaderClick = this.onRowHeaderClick.bind(this);
		this.pageClick = this.pageClick.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onRevert = this.onRevert.bind(this);
		this.isSelected = this.isSelected.bind(this);
		this.isEditing = this.isEditing.bind(this);
		this.isClearing = this.isClearing.bind(this);
		this.handleComponentKey = this.handleComponentKey.bind(this);

		this.handleKeyboardCellMovement =
			this.handleKeyboardCellMovement.bind(this);

		this.defaultState = {
			selecting: false,
			forceEdit: false,
		};

		this.state = this.defaultState;

		this.removeAllListeners = this.removeAllListeners.bind(this);
		this.handleIEClipboardEvents = this.handleIEClipboardEvents.bind(this);
	}

	removeAllListeners() {
		document.removeEventListener("mousedown", this.pageClick);
		document.removeEventListener("mouseup", this.onMouseUp);
		document.removeEventListener("cut", this.handleCut);
		document.removeEventListener("copy", this.handleCopy);
		document.removeEventListener("paste", this.handlePaste);
		document.removeEventListener("keydown", this.handleIEClipboardEvents);
	}

	componentDidMount() {
		// Add listener scoped to the DataSheet that catches otherwise unhandled
		// keyboard events when displaying components
		this.dgDom &&
			this.dgDom.addEventListener("keydown", this.handleComponentKey);
	}

	componentWillUnmount() {
		this.dgDom &&
			this.dgDom.removeEventListener("keydown", this.handleComponentKey);
		this.removeAllListeners();
	}

	isSelectionControlled() {
		// console.log("In isSelectionControlled")
		// console.log(this.props)
		return "selected" in this.props;
	}

	getState() {
		let state = this.state;
		if (this.isSelectionControlled()) {
			let { start, end } = this.props.selected || {};
			start = start || this.defaultState.start;
			end = end || this.defaultState.end;
			state = { ...state, start, end };
		}
		return state;
	}

	_setState(state: DataSheetState) {
		console.log("In setState");
		const { editModeChanged } = this.props;
		if (editModeChanged && state.editing) {
			const wasEditing = !isEmpty(this.state.editing);
			const wilBeEditing = !isEmpty(state.editing);
			if (wasEditing != wilBeEditing) {
				editModeChanged(wilBeEditing);
			}
		}
		if (
			this.isSelectionControlled() &&
			("start" in state || "end" in state)
		) {
			// eslint-disable-next-line prefer-const
			let { start, end, ...rest } = state;
			const { selected } = this.props;
			if (!start) {
				start =
					selected && "start" in selected
						? selected.start
						: this.defaultState.start;
			}
			if (!end) {
				end =
					selected && "end" in selected
						? selected.end
						: this.defaultState.end;
			}
			const { onSelect } = this.props;
			onSelect && onSelect({ start, end });
			this.setState(rest);
		} else {
			this.setState(state);
		}
	}

	onColumnHeaderClick(i: number, j: number, e: MouseEvent) {
		console.log("onColumnHeaderClick");
		console.log(this.props.data);
		console.log(this.props.data.length);
		const endOfColumnIdx = this.props.data.length;
		console.log("i = ", i);
		console.log("j = ", j);
		console.log("endOfColumnIdx = ", endOfColumnIdx)
		console.log(this.state)
		this._setState({
			selecting: true,
			start: { i: 0, j },
			end: { i: endOfColumnIdx, j },
			editing: undefined,
			forceEdit: false,
		});
		console.log(this.state)

		// Cut, copy and paste event handlers
		document.addEventListener("cut", this.handleCut);
		document.addEventListener("copy", this.handleCopy);
		document.addEventListener("paste", this.handlePaste);
	}

	onRowHeaderClick(i: number, j: number, e: MouseEvent) {
		const endOfLineIdx =
			this.props.data.length > 0 ? this.props.data[0].length : 0;

		this._setState({
			selecting: false,
			start: { i: i, j: 0 },
			end: { i: i, j: endOfLineIdx },
			editing: undefined,
			forceEdit: false,
		});

		// Cut, copy and paste event handlers
		document.addEventListener("cut", this.handleCut);
		document.addEventListener("copy", this.handleCopy);
		document.addEventListener("paste", this.handlePaste);
	}

	pageClick(e: MouseEvent) {
		if (this.props.disablePageClick) return;
		const element = this.dgDom;
		if (!element.contains(e.target as Node)) {
			this.setState(this.defaultState);
			this.removeAllListeners();
		}
	}

	handleCut(e: KeyboardEvent) {
		if (isEmpty(this.state.editing)) {
			e.preventDefault();
			this.handleCopy(e);
			const { start, end } = this.getState();
			if (start && end) {
				this.clearSelectedCells(start, end);
			}
		}
	}

	handleIEClipboardEvents(e: KeyboardEvent) {
		if (e.ctrlKey) {
			if (e.key === "c") {
				// C - copy
				this.handleCopy(e);
			} else if (e.key === "x") {
				// X - cut
				this.handleCut(e);
			} else if (e.key === "p") {
				// P - patse
				this.handlePaste(e);
			}
		}
	}

	handleCopy(e: KeyboardEvent) {
		if (isEmpty(this.state.editing)) {
			e.preventDefault();
			const { dataRenderer, valueRenderer, data } = this.props;
			const { start, end } = this.getState();
			if (start && end) {
				if (this.props.handleCopy) {
					this.props.handleCopy({
						event: e,
						dataRenderer,
						valueRenderer,
						data,
						start,
						end,
						range,
					});
				} else {
					const text = range(start.i, end.i)
						.map((i) =>
							range(start.j, end.j)
								.map((j) => {
									const cell = data[i][j];
									const value = dataRenderer
										? dataRenderer(cell, i, j)
										: null;
									if (
										value === "" ||
										value === null ||
										typeof value === "undefined"
									) {
										return valueRenderer(cell, i, j);
									}
									return value;
								})
								.join("\t")
						)
						.join("\n");

					if ("Clipboard" in window) {
						navigator.clipboard
							.writeText(text)
							.then(() => {
								console.log("Copied text to clipboard");
							})
							.catch((err) => {
								console.log(
									"Error copying text to clipboard",
									err
								);
							});
					} else {
						console.log("Could not copy text to clipboard");
					}
				}
			}
		}
	}

	handlePaste(e: KeyboardEvent) {
		if (isEmpty(this.state.editing)) {
			let { start, end } = this.getState();
			if (start && end) {
				start = {
					i: Math.min(start.i, end.i),
					j: Math.min(start.j, end.j),
				};
				end = {
					i: Math.max(start.i, end.i),
					j: Math.max(start.j, end.j),
				};

				const parse = this.props.parsePaste || defaultParsePaste;
				const changes: Array<any> = [];
				let pasteData: Array<Array<string>> = [];
				if ("Clipboard" in window) {
					navigator.clipboard
						.readText()
						.then((text) => {
							console.log("Pasted text from clipboard");
							pasteData = parse(text);
						})
						.catch((err) => {
							console.log(
								"Error pasting text from clipboard",
								err
							);
						});
				} else {
					console.log("Could not copy text to clipboard");
				}

				// in order of preference
				const { data, onCellsChanged, onPaste, onChange } = this.props;
				if (onCellsChanged) {
					const additions: Array<any> = [];
					pasteData.forEach((row, i) => {
						row.forEach((value, j) => {
							end = { i: start.i + i, j: start.j + j };
							const cell = data[end.i] && data[end.i][end.j];
							if (!cell) {
								additions.push({
									row: end.i,
									col: end.j,
									value,
								});
							} else if (!cell.readOnly) {
								changes.push({
									cell,
									row: end.i,
									col: end.j,
									value,
								});
							}
						});
					});
					if (additions.length) {
						onCellsChanged(changes, additions);
					} else {
						onCellsChanged(changes);
					}
				} else if (onPaste) {
					pasteData.forEach((row, i) => {
						const rowData: Array<any> = [];
						row.forEach((pastedData, j) => {
							end = { i: start.i + i, j: start.j + j };
							const cell = data[end.i] && data[end.i][end.j];
							rowData.push({ cell: cell, data: pastedData });
						});
						changes.push(rowData);
					});
					onPaste(changes);
				} else if (onChange) {
					pasteData.forEach((row, i) => {
						row.forEach((value, j) => {
							end = { i: start.i + i, j: start.j + j };
							const cell = data[end.i] && data[end.i][end.j];
							if (cell && !cell.readOnly) {
								onChange(cell, end.i, end.j, value);
							}
						});
					});
				}
				this._setState({ end });
			}
		}
	}

	handleKeyboardCellMovement(e: KeyboardEvent, commit = false) {
		const { start, editing } = this.getState();
		const { data } = this.props;
		const isEditing = editing && !isEmpty(editing);
		const currentCell = start
			? data[start.i] && data[start.i][start.j]
			: undefined;

		if (isEditing && !commit) {
			return false;
		}
		const hasComponent = currentCell && currentCell.component;

		const keyCode = e.which || e.keyCode;

		if (hasComponent && isEditing) {
			e.preventDefault();
			return;
		}

		if (keyCode === TAB_KEY) {
			this.handleNavigate(e, { i: 0, j: e.shiftKey ? -1 : 1 }, true);
		} else if (keyCode === RIGHT_KEY) {
			this.handleNavigate(e, { i: 0, j: 1 });
		} else if (keyCode === LEFT_KEY) {
			this.handleNavigate(e, { i: 0, j: -1 });
		} else if (keyCode === UP_KEY) {
			this.handleNavigate(e, { i: -1, j: 0 });
		} else if (keyCode === DOWN_KEY) {
			this.handleNavigate(e, { i: 1, j: 0 });
		} else if (commit && keyCode === ENTER_KEY) {
			this.handleNavigate(e, { i: e.shiftKey ? -1 : 1, j: 0 });
		}
	}

	handleKey(e: React.KeyboardEvent<HTMLSpanElement>) {
		// if (e.isPropagationStopped && e.isPropagationStopped()) {
		// 	return;
		// }
		const keyCode = e.which || e.keyCode;
		const { start, end, editing } = this.getState();
		const isEditing = editing && !isEmpty(editing);
		const noCellsSelected = !start || isEmpty(start);
		const ctrlKeyPressed = e.ctrlKey || e.metaKey;
		const deleteKeysPressed =
			keyCode === DELETE_KEY || keyCode === BACKSPACE_KEY;
		const enterKeyPressed = keyCode === ENTER_KEY;
		const numbersPressed = keyCode >= 48 && keyCode <= 57;
		const lettersPressed = keyCode >= 65 && keyCode <= 90;
		const latin1Supplement = keyCode >= 160 && keyCode <= 255;
		const numPadKeysPressed = keyCode >= 96 && keyCode <= 105;
		const currentCell =
			!noCellsSelected && this.props.data[start.i][start.j];
		const equationKeysPressed =
			[
				187 /* equal */, 189 /* substract */, 190 /* period */,
				107 /* add */, 109 /* decimal point */, 110,
			].indexOf(keyCode) > -1;

		if (noCellsSelected || ctrlKeyPressed) {
			return true;
		}

		if (!isEditing && end) {
			this.handleKeyboardCellMovement(e.nativeEvent);
			if (deleteKeysPressed) {
				e.preventDefault();
				this.clearSelectedCells(start, end);
			} else if (currentCell && !currentCell.readOnly) {
				if (enterKeyPressed) {
					this._setState({
						editing: start,
						clear: undefined,
						forceEdit: true,
					});
					e.preventDefault();
				} else if (
					numbersPressed ||
					numPadKeysPressed ||
					lettersPressed ||
					latin1Supplement ||
					equationKeysPressed
				) {
					// empty out cell if user starts typing without pressing enter
					this._setState({
						editing: start,
						clear: start,
						forceEdit: false,
					});
				}
			}
		}
	}

	getSelectedCells(
		data: Array<any>,
		start: SelectedCellType,
		end: SelectedCellType
	) {
		const selected: Array<any> = [];
		range(start.i, end.i).map((row) => {
			range(start.j, end.j).map((col) => {
				if (data[row] && data[row][col]) {
					selected.push({ cell: data[row][col], row, col });
				}
			});
		});
		return selected;
	}

	clearSelectedCells(start: SelectedCellType, end: SelectedCellType) {
		const { data, onCellsChanged, onChange } = this.props;
		const cells = this.getSelectedCells(data, start, end)
			.filter((cell) => !cell.cell.readOnly)
			.map((cell) => ({ ...cell, value: "" }));
		if (onCellsChanged) {
			onCellsChanged(cells);
			this.onRevert();
		} else if (onChange) {
			// ugly solution brought to you by https://reactjs.org/docs/react-component.html#setstate
			// setState in a loop is unreliable
			setTimeout(() => {
				cells.forEach(({ cell, row, col, value }) => {
					onChange(cell, row, col, value);
				});
				this.onRevert();
			}, 0);
		}
	}

	updateLocationSingleCell(location: SelectedCellType) {
		this._setState({
			start: location,
			end: location,
			editing: undefined,
		});
	}

	updateLocationMultipleCells(offsets: SelectedCellType) {
		const { start, end } = this.getState();
		const { data } = this.props;
		const oldStartLocation = { i: start.i, j: start.j };
		const newEndLocation = {
			i: end.i + offsets.i,
			j: Math.min(data[0].length - 1, Math.max(0, end.j + offsets.j)),
		};
		this._setState({
			start: oldStartLocation,
			end: newEndLocation,
			editing: undefined,
		});
	}

	searchForNextSelectablePos(
		isCellNavigable: FunctionType,
		data: Array<any>,
		start: SelectedCellType,
		offsets: SelectedCellType,
		jumpRow: boolean
	): SelectedCellType | null {
		const previousRow = (location: SelectedCellType) => ({
			i: location.i - 1,
			j: data[0].length - 1,
		});
		const nextRow = (location: SelectedCellType) => ({
			i: location.i + 1,
			j: 0,
		});
		const advanceOffset = (location: SelectedCellType) => ({
			i: location.i + offsets.i,
			j: location.j + offsets.j,
		});
		const isCellDefined = ({ i, j }: SelectedCellType) =>
			data[i] && typeof data[i][j] !== "undefined";

		let newLocation = advanceOffset(start);

		while (
			isCellDefined(newLocation) &&
			!isCellNavigable(
				data[newLocation.i][newLocation.j],
				newLocation.i,
				newLocation.j
			)
		) {
			newLocation = advanceOffset(newLocation);
		}

		if (!isCellDefined(newLocation)) {
			if (!jumpRow) {
				return null;
			}
			if (offsets.j < 0) {
				newLocation = previousRow(newLocation);
			} else {
				newLocation = nextRow(newLocation);
			}
		}

		if (
			isCellDefined(newLocation) &&
			!isCellNavigable(
				data[newLocation.i][newLocation.j],
				newLocation.i,
				newLocation.j
			)
		) {
			return this.searchForNextSelectablePos(
				isCellNavigable,
				data,
				newLocation,
				offsets,
				jumpRow
			);
		} else if (isCellDefined(newLocation)) {
			return newLocation;
		} else {
			return null;
		}
	}

	handleNavigate(
		e: KeyboardEvent,
		offsets: SelectedCellType,
		jumpRow = false
	) {
		if (offsets && (offsets.i || offsets.j)) {
			const { data } = this.props;
			const { start } = this.getState();

			if (start) {
				const multiSelect = e.shiftKey && !jumpRow;
				const isCellNavigable = this.props.isCellNavigable
					? this.props.isCellNavigable
					: () => true;

				if (multiSelect) {
					this.updateLocationMultipleCells(offsets);
				} else {
					const newLocation = this.searchForNextSelectablePos(
						isCellNavigable,
						data,
						start,
						offsets,
						jumpRow
					);
					if (newLocation) {
						this.updateLocationSingleCell(newLocation);
					}
				}
				e.preventDefault();
			}
		}
	}

	handleComponentKey(e: KeyboardEvent) {
		// handles keyboard events when editing components
		const keyCode = e.which || e.keyCode;
		if (![ENTER_KEY, ESCAPE_KEY, TAB_KEY].includes(keyCode)) {
			return;
		}
		const { editing } = this.state;

		if (editing) {
			const { data } = this.props;
			const isEditing = !isEmpty(editing);
			if (isEditing) {
				const currentCell = data[editing.i][editing.j];
				const offset = e.shiftKey ? -1 : 1;
				if (
					currentCell &&
					currentCell.component &&
					!currentCell.forceComponent
				) {
					e.preventDefault();
					let func = this.onRevert; // ESCAPE_KEY
					if (keyCode === ENTER_KEY) {
						func = () =>
							this.handleNavigate(e, { i: offset, j: 0 });
					} else if (keyCode === TAB_KEY) {
						func = () =>
							this.handleNavigate(e, { i: 0, j: offset }, true);
					}
					// setTimeout makes sure that component is done handling the event before we take over
					setTimeout(() => {
						func();
						this.dgDom && this.dgDom.focus({ preventScroll: true });
					}, 1);
				}
			}
		}
	}

	onContextMenu(evt: MouseEvent, i: number, j: number) {
		const cell: any = this.props.data[i][j];
		if (this.props.onContextMenu) {
			this.props.onContextMenu(evt, cell, i, j);
		}
	}

	onDoubleClick(i: number, j: number) {
		console.log("in onDoubleClick");
		const cell = this.props.data[i][j];
		console.log("cell: ");
		console.log(cell);
		if (!cell.readOnly) {
			this._setState({
				editing: { i: i, j: j },
				forceEdit: true,
				clear: undefined,
			});
		}
	}

	onMouseDown(i: number, j: number, e: MouseEvent) {
		const isNowEditingSameCell =
			!isEmpty(this.state.editing) &&
			this.state.editing.i === i &&
			this.state.editing.j === j;

		const editing =
			isEmpty(this.state.editing) ||
			this.state.editing.i !== i ||
			this.state.editing.j !== j
				? undefined
				: this.state.editing;

		this._setState({
			selecting: !isNowEditingSameCell,
			start: e.shiftKey ? this.getState().start : { i, j },
			end: { i, j },
			editing: editing,
			forceEdit: !!isNowEditingSameCell,
		});

		// Keep listening to mouse if user releases the mouse (dragging outside)
		document.addEventListener("mouseup", this.onMouseUp);
		// Listen for any outside mouse clicks
		document.addEventListener("mousedown", this.pageClick);

		// Cut, copy and paste event handlers
		document.addEventListener("cut", this.handleCut);
		document.addEventListener("copy", this.handleCopy);
		document.addEventListener("paste", this.handlePaste);
	}

	onMouseOver(i: number, j: number) {
		if (this.state.selecting && isEmpty(this.state.editing)) {
			this._setState({ end: { i, j } });
		}
	}

	onMouseUp() {
		this._setState({ selecting: false });
		document.removeEventListener("mouseup", this.onMouseUp);
	}

	onChange(row: number, col: number, value: string) {
		const { onChange, onCellsChanged, data } = this.props;
		if (onCellsChanged) {
			onCellsChanged([{ cell: data[row][col], row, col, value }]);
		} else if (onChange) {
			onChange(data[row][col], row, col, value);
		}
		this.onRevert();
	}

	onRevert() {
		this._setState({ editing: undefined });
		// setTimeout makes sure that component is done handling the new state before we take over
		setTimeout(() => {
			this.dgDom && this.dgDom.focus({ preventScroll: true });
		}, 1);
	}

	componentDidUpdate(prevProps: DataSheetProps, prevState: DataSheetState) {
		const { start, end } = this.state;
		const prevEnd = prevState.end;
		if (
			end &&
			prevEnd &&
			!(end.i === prevEnd.i && end.j === prevEnd.j) &&
			!this.isSelectionControlled()
		) {
			this.props.onSelect && this.props.onSelect({ start, end });
		}
	}

	isSelectedRow(rowIndex: number) {
		console.log("In isSelectedRow");
		const { start, end } = this.getState();
		if (start && end) {
			const startY = start.i;
			const endY = end.i;
			if (startY <= endY) {
				return rowIndex >= startY && rowIndex <= endY;
			} else {
				return rowIndex <= startY && rowIndex >= endY;
			}
		}
		return false;
	}

	isSelected(i: number, j: number) {
		const { start, end } = this.getState();
		if (start && end) {
			const posX = j >= start.j && j <= end.j;
			const negX = j <= start.j && j >= end.j;
			const posY = i >= start.i && i <= end.i;
			const negY = i <= start.i && i >= end.i;
			return (
				(posX && posY) ||
				(negX && posY) ||
				(negX && negY) ||
				(posX && negY)
			);
		}
		return false;
	}

	isEditing(i: number, j: number) {
		return this.state.editing?.i === i && this.state.editing?.j === j;
	}

	isClearing(i: number, j: number) {
		return this.state.clear?.i === i && this.state.clear?.j === j;
	}

	render() {
		const {
			sheetRenderer: SheetRenderer,
			rowRenderer: RowRenderer,
			cellRenderer,
			dataRenderer,
			valueRenderer,
			dataEditor,
			valueViewer,
			attributesRenderer,
			className,
			overflow,
			data,
			columns,
			keyFn,
		} = this.props;
		const { forceEdit } = this.state;

		return (
			<span
				ref={(r) => {
					if (r) {
						this.dgDom = r;
					}
				}}
				tabIndex={0}
				className="data-grid-container"
				onKeyDown={this.handleKey}
			>
				<SheetRenderer
					data={data}
					className={["data-grid", className, overflow]
						.filter((a) => a)
						.join(" ")}
				>
					<th className="cell read-only" />
					{columns &&
						columns.map((col, j) => {
							const vertSeperator: CellShapeType = {
								className: "vert-separator",
							};
							return (
								<>
									<DataCell
										key={`0-${j}-vert-sep`}
										row={0}
										col={j}
										cell={vertSeperator}
										forceEdit={forceEdit}
										onMouseDown={this.onMouseDown}
										onMouseOver={this.onMouseOver}
										onDoubleClick={() => {}}
										onContextMenu={this.onContextMenu}
										onChange={this.onChange}
										onRevert={this.onRevert}
										onNavigate={
											this.handleKeyboardCellMovement
										}
										onKey={this.handleKey}
										selected={false}
										editing={false}
										clearing={false}
										attributesRenderer={() => {}}
										cellRenderer={cellRenderer}
										valueRenderer={valueRenderer}
										dataRenderer={dataRenderer}
										valueViewer={valueViewer}
										dataEditor={dataEditor}
									/>
									<ColumnHeader
										column={j}
										name={col.name}
										onMouseDown={this.onColumnHeaderClick}
									></ColumnHeader>
								</>
							);
						})}
					{data.map((row, i) => {
						const vertSeperator: CellShapeType = {
							className: "vert-separator",
						};
						return (
							<RowRenderer
								key={keyFn ? keyFn(i) : i}
								row={i}
								cells={row}
								selected={this.isSelectedRow(i)}
							>
								<RowHeader
									row={i}
									onMouseDown={this.onRowHeaderClick}
								/>
								{row.map((cell, j) => {
									const isEditing = this.isEditing(i, j);
									// console.log("in cell renderer");
									// console.log(cell);
									// console.log(j);
									// console.log("end in cell renderer");
									return (
										<>
											<DataCell
												key={`${i}-${j}-vert-sep`}
												row={i}
												col={j}
												cell={vertSeperator}
												forceEdit={forceEdit}
												onMouseDown={this.onMouseDown}
												onMouseOver={this.onMouseOver}
												onDoubleClick={() => {}}
												onContextMenu={
													this.onContextMenu
												}
												onChange={this.onChange}
												onRevert={this.onRevert}
												onNavigate={
													this
														.handleKeyboardCellMovement
												}
												onKey={this.handleKey}
												selected={false}
												editing={false}
												clearing={false}
												attributesRenderer={() => {}}
												cellRenderer={cellRenderer}
												valueRenderer={valueRenderer}
												dataRenderer={dataRenderer}
												valueViewer={valueViewer}
												dataEditor={dataEditor}
											/>
											<DataCell
												key={
													cell.key
														? cell.key
														: `${i}-${j}`
												}
												row={i}
												col={j}
												cell={cell}
												forceEdit={forceEdit}
												onMouseDown={this.onMouseDown}
												onMouseOver={this.onMouseOver}
												onDoubleClick={
													this.onDoubleClick
												}
												onContextMenu={
													this.onContextMenu
												}
												onChange={this.onChange}
												onRevert={this.onRevert}
												onNavigate={
													this
														.handleKeyboardCellMovement
												}
												onKey={this.handleKey}
												selected={this.isSelected(i, j)}
												editing={isEditing}
												clearing={this.isClearing(i, j)}
												attributesRenderer={
													attributesRenderer
												}
												cellRenderer={cellRenderer}
												valueRenderer={valueRenderer}
												dataRenderer={dataRenderer}
												valueViewer={valueViewer}
												dataEditor={dataEditor}
												{...(isEditing
													? { forceEdit }
													: {})}
											/>
										</>
									);
								})}
							</RowRenderer>
						);
					})}
				</SheetRenderer>
			</span>
		);
	}
}
