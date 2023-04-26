import React from 'react';

import { CellShapeType } from './CellShape';
import { renderValue } from './renderHelpers';
import ValueViewer from './ValueViewer';

type FunctionType = (...args: any[]) => any;

export interface RowSeparatorProps {
	row: number;
	col: number;
	onMouseDown: FunctionType;
	onDoubleClick: FunctionType;
	onContextMenu: FunctionType;
}

export default class RowSeparator extends React.Component<RowSeparatorProps> {
	constructor(props: RowSeparatorProps) {
		super(props);

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
	}

	handleMouseDown(e: MouseEvent) {
		const { row, col, onMouseDown } = this.props;
		onMouseDown(row, col, e);
	}

	handleDoubleClick(e: MouseEvent) {
		const { row, col, onDoubleClick } = this.props;
		onDoubleClick(row, col);
	}

	handleContextMenu(e: MouseEvent) {
		const { row, col, onContextMenu } = this.props;
		onContextMenu(e, row, col);
	}

	renderComponent(editing: boolean, cell: CellShapeType) {
		const { component, readOnly, forceComponent } = cell;
		if ((editing && !readOnly) || forceComponent) {
			return component;
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
		const className = ["cell", "row-separator"].filter((a) => a).join(" ");

		return (
			<td
				className={className}
				onMouseDown={this.handleMouseDown}
				onDoubleClick={this.handleDoubleClick}
				onTouchEnd={this.handleDoubleClick}
				onContextMenu={this.handleContextMenu}
			/>
		);
	}
}
