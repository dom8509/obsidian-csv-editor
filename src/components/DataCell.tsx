import { useEditable, useEditableDispatch } from 'context/EditableContext';
import React from 'react';
import { IBodyCell, IColumn, IHeaderCell } from 'types/table';

import Cell from './Cell';
import DataEditor from './DataEditor';
import ValueViewer from './ValueViewer';

type FunctionType = (...args: any[]) => any;

export interface DataCellProps {
	row: number;
	column: number;
	cell: IBodyCell | IHeaderCell;
	columnData: IColumn;
	className?: string;
	selected?: boolean;
	readOnly?: boolean;
	// cellRenderer?: FunctionType;
	// valueRenderer: FunctionType;
	// dataRenderer?: FunctionType;
	// valueViewer?: FunctionType;
	// dataEditor?: FunctionType;
	// attributesRenderer?: FunctionType;
	// onNavigate: FunctionType;
	onMouseDown: FunctionType;
	onMouseOver: FunctionType;
	onDoubleClick: FunctionType;
	// onContextMenu: FunctionType;
	onChange: FunctionType;
	// onRevert: FunctionType;
	// onEdit?: FunctionType;
	// onKeyUp?: FunctionType;
	// onKey: FunctionType;
}

// interface DataSheetState {
// 	reverting: boolean;
// 	committing: boolean;
// 	updated: boolean;
// 	value: any;
// }

// function initialData({
// 	cell,
// 	row,
// 	col,
// 	valueRenderer,
// 	dataRenderer,
// }: DataCellProps) {
// 	return renderData(cell, row, col, valueRenderer, dataRenderer);
// }

// function initialValue({ cell, row, col, valueRenderer }: DataCellProps) {
// 	return renderValue(cell, row, col, valueRenderer);
// }

// function widthStyle(cell: CellShapeType) {
// 	const width =
// 		typeof cell.width === "number" ? cell.width + "px" : cell.width;
// 	return width ? { width } : null;
// }

const DataCell: React.FC<DataCellProps> = (props: DataCellProps) => {
	const editable = useEditable();
	const dispatchEditable = useEditableDispatch();

	// timeout: NodeJS.Timeout;

	// componentDidUpdate(prevProps: DataCellProps) {
	// 	if (
	// 		!this.props.cell.disableUpdatedFlag &&
	// 		initialValue(prevProps) !== initialValue(this.props)
	// 	) {
	// 		this.setState({ updated: true });
	// 		this.timeout = setTimeout(
	// 			() => this.setState({ updated: false }),
	// 			700
	// 		);
	// 	}
	// 	if (this.props.editing === true && prevProps.editing === false) {
	// 		const value = this.props.clearing ? "" : initialData(this.props);
	// 		this.setState({ value, reverting: false });
	// 	}

	// 	if (
	// 		prevProps.editing === true &&
	// 		this.props.editing === false &&
	// 		!this.state.reverting &&
	// 		!this.state.committing &&
	// 		this.state.value !== initialData(this.props)
	// 	) {
	// 		this.props.onChange(
	// 			this.props.row,
	// 			this.props.col,
	// 			this.state.value
	// 		);
	// 	}
	// }

	// componentWillUnmount() {
	// 	clearTimeout(this.timeout);
	// }

	// handleChange(value: any) {
	// 	this.setState({ value, committing: false });
	// }

	// handleCommit(value: any, e: any) {
	// 	const { onChange, onNavigate } = this.props;
	// 	if (value !== initialData(this.props)) {
	// 		this.setState({ value, committing: true });
	// 		onChange(this.props.row, this.props.col, value);
	// 	} else {
	// 		this.handleRevert();
	// 	}
	// 	if (e) {
	// 		e.preventDefault();
	// 		onNavigate(e, true);
	// 	}
	// }

	// handleRevert() {
	// 	this.setState({ reverting: true });
	// 	this.props.onRevert();
	// }

	// handleMouseDown(e: MouseEvent) {
	// 	const { row, col, onMouseDown, cell } = this.props;
	// 	if (!cell.disableEvents) {
	// 		onMouseDown(row, col, e);
	// 	}
	// }

	// handleMouseOver(e: MouseEvent) {
	// 	const { row, col, onMouseOver, cell } = this.props;
	// 	if (!cell.disableEvents) {
	// 		onMouseOver(row, col);
	// 	}
	// }

	const handleChange = (value: string) => {
		props.onChange(props.cell, value);
	};

	// handleContextMenu(e: MouseEvent) {
	// 	const { row, col, onContextMenu, cell } = this.props;
	// 	if (!cell.disableEvents) {
	// 		onContextMenu(e, row, col);
	// 	}
	// }

	// handleKey(e: KeyboardEvent) {
	// 	const keyCode = e.which || e.keyCode;
	// 	if (keyCode === ESCAPE_KEY) {
	// 		return this.handleRevert();
	// 	}
	// 	const {
	// 		cell: { component },
	// 		forceEdit,
	// 	} = this.props;
	// 	const eatKeys = forceEdit || !!component;
	// 	const commit =
	// 		keyCode === ENTER_KEY ||
	// 		keyCode === TAB_KEY ||
	// 		(!eatKeys &&
	// 			[LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY].includes(keyCode));

	// 	if (commit) {
	// 		this.handleCommit(this.state.value, e);
	// 	}
	// }

	const isEditing = (cellId: string): boolean => {
		return editable.cellId ? editable.cellId === cellId : false;
	};

	const className = [
		props.className,
		"cell",
		props.columnData.overflow,
		props.selected && "selected",
		props.readOnly && "read-only",
	]
		.filter((a) => a)
		.join(" ");

	// console.log("Cell in renderer")
	// console.log(cell)
	// console.log("ClassName: ", className)
	return (
		<Cell
			row={props.row}
			column={props.column}
			cell={props.cell}
			className={className}
			onMouseDown={props.onMouseDown}
			onMouseOver={props.onMouseOver}
			onDoubleClick={props.onDoubleClick}
			// onContextMenu={props.onContextMenu}
		>
			{isEditing(props.cell.id) ? (
				<DataEditor
					value={props.cell.markdown}
					onChange={handleChange}
				/>
			) : (
				<ValueViewer
					value={props.cell.markdown}
				/>
			)}
		</Cell>
	);
};

export default DataCell;
