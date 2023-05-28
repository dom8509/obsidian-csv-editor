import React, { ReactNode } from 'react';
import { IBodyCell, IFooterCell, IHeaderCell } from 'types/table';

type FunctionType = (...args: any[]) => any;

export interface CellProps {
	row: number;
	column: number;
	cell: IBodyCell | IHeaderCell | IFooterCell;
	selected?: boolean;
	onMouseDown: FunctionType;
	onMouseOver: FunctionType;
	onDoubleClick: FunctionType;
	// onContextMenu: FunctionType;
	className?: string;
	children?: ReactNode;
}

const Cell: React.FC<CellProps> = (props: CellProps) => {
	return (
		<td
			key={props.cell.id}
			className={props.className}
			onMouseDown={props.onMouseDown}
			onMouseOver={props.onMouseOver}
			onDoubleClick={props.onDoubleClick}
			// onTouchEnd={props.onDoubleClick}
			// onContextMenu={props.onContextMenu}
		>
			{props.children}
		</td>
	);
};

export default Cell;