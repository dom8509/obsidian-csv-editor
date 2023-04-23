import React from 'react';

import Cell from './Cell';
import { CellShapeType } from './CellShape';
import DataEditor from './DataEditor';
import { DOWN_KEY, ENTER_KEY, ESCAPE_KEY, LEFT_KEY, RIGHT_KEY, TAB_KEY, UP_KEY } from './keys';
import { renderData, renderValue } from './renderHelpers';
import ValueViewer from './ValueViewer';

type FunctionType = (...args: any[]) => any;

export interface DataCellProps {
	row: number;
	col: number;
	cell: CellShapeType;
	forceEdit: boolean;
	selected?: boolean;
	editing?: boolean;
	editValue?: any;
	clearing?: boolean;
	cellRenderer?: FunctionType;
	valueRenderer: FunctionType;
	dataRenderer?: FunctionType;
	valueViewer?: FunctionType;
	dataEditor?: FunctionType;
	attributesRenderer?: FunctionType;
	onNavigate: FunctionType;
	onMouseDown: FunctionType;
	onMouseOver: FunctionType;
	onDoubleClick: FunctionType;
	onContextMenu: FunctionType;
	onChange: FunctionType;
	onRevert: FunctionType;
	onEdit?: FunctionType;
	onKeyUp?: FunctionType;
	onKey: FunctionType;
}

interface DataSheetState {
	reverting: boolean;
	committing: boolean;
	updated: boolean;
	value: any;
}

function initialData({
	cell,
	row,
	col,
	valueRenderer,
	dataRenderer,
}: DataCellProps) {
	return renderData(cell, row, col, valueRenderer, dataRenderer);
}

function initialValue({ cell, row, col, valueRenderer }: DataCellProps) {
	return renderValue(cell, row, col, valueRenderer);
}

function widthStyle(cell: CellShapeType) {
	const width =
		typeof cell.width === "number" ? cell.width + "px" : cell.width;
	return width ? { width } : null;
}

export default class DataCell extends React.Component<
	DataCellProps,
	DataSheetState
> {
	timeout: NodeJS.Timeout;

	static defaultProps = {
		forceEdit: false,
		selected: false,
		editing: false,
		clearing: false,
		cellRenderer: Cell,
	};

	constructor(props: DataCellProps) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleCommit = this.handleCommit.bind(this);
		this.handleRevert = this.handleRevert.bind(this);

		this.handleKey = this.handleKey.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);

		this.state = {
			updated: false,
			reverting: false,
			committing: false,
			value: "",
		};
	}

	componentDidUpdate(prevProps: DataCellProps) {
		if (
			!this.props.cell.disableUpdatedFlag &&
			initialValue(prevProps) !== initialValue(this.props)
		) {
			this.setState({ updated: true });
			this.timeout = setTimeout(
				() => this.setState({ updated: false }),
				700
			);
		}
		if (this.props.editing === true && prevProps.editing === false) {
			const value = this.props.clearing ? "" : initialData(this.props);
			this.setState({ value, reverting: false });
		}

		if (
			prevProps.editing === true &&
			this.props.editing === false &&
			!this.state.reverting &&
			!this.state.committing &&
			this.state.value !== initialData(this.props)
		) {
			this.props.onChange(
				this.props.row,
				this.props.col,
				this.state.value
			);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	handleChange(value: any) {
		this.setState({ value, committing: false });
	}

	handleCommit(value: any, e: any) {
		const { onChange, onNavigate } = this.props;
		if (value !== initialData(this.props)) {
			this.setState({ value, committing: true });
			onChange(this.props.row, this.props.col, value);
		} else {
			this.handleRevert();
		}
		if (e) {
			e.preventDefault();
			onNavigate(e, true);
		}
	}

	handleRevert() {
		this.setState({ reverting: true });
		this.props.onRevert();
	}

	handleMouseDown(e: MouseEvent) {
		const { row, col, onMouseDown, cell } = this.props;
		if (!cell.disableEvents) {
			onMouseDown(row, col, e);
		}
	}

	handleMouseOver(e: MouseEvent) {
		const { row, col, onMouseOver, cell } = this.props;
		if (!cell.disableEvents) {
			onMouseOver(row, col);
		}
	}

	handleDoubleClick(e: MouseEvent) {
		const { row, col, onDoubleClick, cell } = this.props;
		if (!cell.disableEvents) {
			onDoubleClick(row, col);
		}
	}

	handleContextMenu(e: MouseEvent) {
		const { row, col, onContextMenu, cell } = this.props;
		if (!cell.disableEvents) {
			onContextMenu(e, row, col);
		}
	}

	handleKey(e: KeyboardEvent) {
		const keyCode = e.which || e.keyCode;
		if (keyCode === ESCAPE_KEY) {
			return this.handleRevert();
		}
		const {
			cell: { component },
			forceEdit,
		} = this.props;
		const eatKeys = forceEdit || !!component;
		const commit =
			keyCode === ENTER_KEY ||
			keyCode === TAB_KEY ||
			(!eatKeys &&
				[LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY].includes(keyCode));

		if (commit) {
			this.handleCommit(this.state.value, e);
		}
	}

	renderComponent(editing: boolean, cell: CellShapeType) {
		const { component, readOnly, forceComponent } = cell;
		if ((editing && !readOnly) || forceComponent) {
			return component;
		}
	}

	renderEditor(
		editing: boolean,
		cell: CellShapeType,
		row: number,
		col: number,
		dataEditor: FunctionType
	) {
		if (editing) {
			const Editor = cell.dataEditor || dataEditor || DataEditor;
			return (
				<Editor
					cell={cell}
					row={row}
					col={col}
					value={this.state.value}
					onChange={this.handleChange}
					onCommit={this.handleCommit}
					onRevert={this.handleRevert}
					onKeyDown={this.handleKey}
				/>
			);
		}
	}

	renderViewer(
		cell: CellShapeType,
		row: number,
		col: number,
		valueRenderer: FunctionType,
		valueViewer: FunctionType
	) {
		const Viewer = cell.valueViewer || valueViewer || ValueViewer;
		const value = renderValue(cell, row, col, valueRenderer);
		return <Viewer cell={cell} row={row} col={col} value={value} />;
	}

	render() {
		const {
			row,
			col,
			cell,
			cellRenderer: CellRenderer,
			valueRenderer,
			dataEditor,
			valueViewer,
			attributesRenderer,
			selected,
			editing,
			onKeyUp,
		} = this.props;
		const { updated } = this.state;

		const content =
			this.renderComponent(editing, cell) ||
			this.renderEditor(editing, cell, row, col, dataEditor) ||
			this.renderViewer(cell, row, col, valueRenderer, valueViewer);

		const className = [
			cell.className,
			"cell",
			cell.overflow,
			selected && "selected",
			editing && "editing",
			cell.readOnly && "read-only",
			updated && "updated",
		]
			.filter((a) => a)
			.join(" ");

		// console.log("Cell in renderer")
		// console.log(cell)
		// console.log("ClassName: ", className)
		return (
			<CellRenderer
				row={row}
				col={col}
				cell={cell}
				selected={selected}
				editing={editing}
				updated={updated}
				attributesRenderer={attributesRenderer}
				className={className}
				style={widthStyle(cell)}
				onMouseDown={this.handleMouseDown}
				onMouseOver={this.handleMouseOver}
				onDoubleClick={this.handleDoubleClick}
				onContextMenu={this.handleContextMenu}
				onKeyUp={onKeyUp}
			>
				{content}
			</CellRenderer>
		);
	}
}
