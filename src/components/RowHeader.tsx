import React, { MouseEventHandler } from 'react';

import { CellShapeType } from './CellShape';

type FunctionType = (...args: any[]) => any;

export const ROW_HEADER_IDX = -1;

export interface RowHeaderProps {
	row: number;
	selected?: boolean;
	attributesRenderer?: FunctionType;
	onMouseDown: FunctionType;
	// onMouseOver: FunctionType;
	// onDoubleClick: FunctionType;
	// onContextMenu: FunctionType;
	// className?: string;
	// style?: React.CSSProperties;
}

export default class RowHeader extends React.Component<RowHeaderProps> {
	static defaultProps = {
		selected: false,
		attributesRenderer: () => {},
	};

	constructor(props: RowHeaderProps) {
		super(props);
		
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}

	handleMouseDown(e: MouseEvent) {
		console.log(e)
		const { row, onMouseDown } = this.props;
		onMouseDown(row, -1, e);
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
				// onMouseOver={onMouseOver}
				// onDoubleClick={onDoubleClick}
				// onTouchEnd={onDoubleClick}
				// onContextMenu={onContextMenu}
				// colSpan={colSpan}
				// rowSpan={rowSpan}
				// style={style}
				// {...attributes}
			>
				{row + 1}
			</td>
		);
	}
}
