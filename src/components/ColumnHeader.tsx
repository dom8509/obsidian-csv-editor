import React from 'react';

import { CellShapeType } from './CellShape';

type FunctionType = (...args: any[]) => any;

export const COLUMN_HEADER_IDX = -1;

export interface ColumnHeaderProps {
	column: number;
	name: string;
	selected?: boolean;
	attributesRenderer?: FunctionType;
	onMouseDown: FunctionType;
	onMouseOver: FunctionType;
	onContextMenu: FunctionType;
}

export default class ColumnHeader extends React.Component<ColumnHeaderProps> {
	static defaultProps = {
		selected: false,
		attributesRenderer: () => {},
	};

	constructor(props: ColumnHeaderProps) {
		super(props);

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
	}

	handleMouseDown(e: MouseEvent) {
		const { column, onMouseDown } = this.props;
		onMouseDown(COLUMN_HEADER_IDX, column, e);
	}

	handleMouseOver(e: MouseEvent) {
		const { column, onMouseOver } = this.props;
		onMouseOver(COLUMN_HEADER_IDX, column, e);
	}

	handleContextMenu(e: MouseEvent) {
		const { column, onContextMenu } = this.props;
		onContextMenu(e, COLUMN_HEADER_IDX, column);
	}

	render() {
		const { name, selected } = this.props;

		const className = [
			"cell",
			selected && "selected",
			"read-only",
			"column-header",
			`{column}-idx`,
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
				{name}
			</td>
		);
	}
}
