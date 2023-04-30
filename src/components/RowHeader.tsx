import React from 'react';

import { CellShapeType } from './CellShape';

type FunctionType = (...args: any[]) => any;

export const ROW_HEADER_IDX = -1;

export interface RowHeaderProps {
	row: number;
	selected?: boolean;
	attributesRenderer?: FunctionType;
	onMouseDown: FunctionType;
	onMouseOver: FunctionType;
	onContextMenu: FunctionType;
}

export default class RowHeader extends React.Component<RowHeaderProps> {
	static defaultProps = {
		selected: false,
		attributesRenderer: () => {},
	};

	constructor(props: RowHeaderProps) {
		super(props);

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
	}

	handleMouseDown(e: MouseEvent) {
		console.log(e);
		const { row, onMouseDown } = this.props;
		onMouseDown(row, ROW_HEADER_IDX, e);
	}

	handleMouseOver(e: MouseEvent) {
		const { row, onMouseOver } = this.props;
		onMouseOver(row, ROW_HEADER_IDX, e);
	}

	handleContextMenu(e: MouseEvent) {
		const { row, onContextMenu } = this.props;
		onContextMenu(e, row, ROW_HEADER_IDX);
	}

	render() {
		const { row, selected } = this.props;

		const className = [
			"cell",
			selected && "selected",
			"read-only",
			"row-header",
			`{row}-idx`,
		]
			.filter((a) => a)
			.join(" ");

		return (
			<td
				className={className}
				onMouseDown={this.handleMouseDown}
				onMouseOver={this.handleMouseOver}
				onContextMenu={this.handleContextMenu}
			>
				{row + 1}
			</td>
		);
	}
}
