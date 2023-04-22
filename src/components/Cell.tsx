import React, { ReactNode } from 'react';

import { CellShapeType } from './CellShape';

type FunctionType = (...args: any[]) => any;

export interface CellProps {
	row: number;
	col: number;
	cell: CellShapeType;
	selected?: boolean;
	editing?: boolean;
	updated?: boolean;
	attributesRenderer?: FunctionType;
	onMouseDown: FunctionType;
	onMouseOver: FunctionType;
	onDoubleClick: FunctionType;
	onContextMenu: FunctionType;
	className?: string;
	style?: React.CSSProperties;
	children?: ReactNode;
}

export default class Cell extends React.Component<CellProps> {
	static defaultProps = {
		selected: false,
		editing: false,
		updated: false,
		attributesRenderer: () => {},
	};

	render() {
		const {
			cell,
			row,
			col,
			attributesRenderer,
			className,
			style,
			onMouseDown,
			onMouseOver,
			onDoubleClick,
			onContextMenu,
		} = this.props;

		const { colSpan, rowSpan } = cell;
		const attributes = attributesRenderer
			? attributesRenderer(cell, row, col)
			: {};
			
		return (
			<td
				className={className}
				onMouseDown={onMouseDown}
				onMouseOver={onMouseOver}
				onDoubleClick={onDoubleClick}
				onTouchEnd={onDoubleClick}
				onContextMenu={onContextMenu}
				colSpan={colSpan}
				rowSpan={rowSpan}
				style={style}
				{...attributes}
			>
				{this.props.children}
			</td>
		);
	}
}
