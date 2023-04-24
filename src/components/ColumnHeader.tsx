import React, { MouseEventHandler } from 'react';

import { CellShapeType } from './CellShape';

type FunctionType = (...args: any[]) => any;

export const COLUMN_HEADER_IDX = -1;

export interface ColumnHeaderProps {
	column: number;
	name: string;
	selected?: boolean;
	attributesRenderer?: FunctionType;
	onMouseDown: FunctionType;
	// onMouseOver: FunctionType;
	// onDoubleClick: FunctionType;
	// onContextMenu: FunctionType;
	// className?: string;
	// style?: React.CSSProperties;
}

export default class ColumnHeader extends React.Component<ColumnHeaderProps> {
	static defaultProps = {
		selected: false,
		attributesRenderer: () => {},
	};

	constructor(props: ColumnHeaderProps) {
		super(props);
		
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}

	handleMouseDown(e: MouseEvent) {
		console.log(e)
		const { column, onMouseDown } = this.props;
		onMouseDown(-1, column, e);
	}

	render() {
		const { column, name, selected } = this.props;

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
				// onMouseOver={onMouseOver}
				// onDoubleClick={onDoubleClick}
				// onTouchEnd={onDoubleClick}
				// onContextMenu={onContextMenu}
				// colSpan={colSpan}
				// rowSpan={rowSpan}
				// style={style}
				// {...attributes}
			>
				{name}
			</td>
		);
	}
}
