import React from 'react';

type FunctionType = (...args: any[]) => any;

export interface ColumnSeparatorProps {
	row: number;
	col: number;
	onMouseDown: FunctionType;
	onDoubleClick: FunctionType;
	onContextMenu: FunctionType;
}

export default class ColumnSeparator extends React.Component<ColumnSeparatorProps> {
	constructor(props: ColumnSeparatorProps) {
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

	render() {
		const className = ["cell", "column-separator"].filter((a) => a).join(" ");

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
