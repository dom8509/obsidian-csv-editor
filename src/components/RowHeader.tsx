import React from 'react';

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

const RowHeader: React.FC<RowHeaderProps> = (props: RowHeaderProps) => {
	const className = [
		"cell",
		props.selected && "selected",
		"read-only",
		"row-header",
	]
		.filter((a) => a)
		.join(" ");

	return (
		<td
			className={className}
			onMouseDown={(e) => props.onMouseDown(props.row, ROW_HEADER_IDX, e)}
			onMouseOver={(e) => props.onMouseOver(props.row, ROW_HEADER_IDX, e)}
			onContextMenu={(e) =>
				props.onContextMenu(e, props.row, ROW_HEADER_IDX)
			}
		>
			{props.row + 1}
		</td>
	);
};

export default RowHeader;