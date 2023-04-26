import React from 'react';

type FunctionType = (...args: any[]) => any;

export const COLUMN_HEADER_IDX = -1;

export interface ColumnHeaderProps {
	column: number;
	name: string;
	selected?: boolean;
	attributesRenderer?: FunctionType;
	onMouseDown: FunctionType;
	onMouseOver: FunctionType;
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
	}

	handleMouseDown(e: MouseEvent) {
		const { column, onMouseDown } = this.props;
		onMouseDown(COLUMN_HEADER_IDX, column, e);
	}

	handleMouseOver(e: MouseEvent) {
		const { column, onMouseOver } = this.props;
		onMouseOver(COLUMN_HEADER_IDX, column, e);
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
			>
				{name}
			</td>
		);
	}
}
