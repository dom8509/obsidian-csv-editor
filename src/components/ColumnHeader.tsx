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
	onContextMenu: FunctionType;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = (
	props: ColumnHeaderProps
) => {
	const className = [
		"cell",
		props.selected && "selected",
		"read-only",
		"column-header",
		`{column}-idx`,
	]
		.filter((a) => a)
		.join(" ");

	return (
		<td
			className={className}
			onMouseDown={(e) =>
				props.onMouseDown(COLUMN_HEADER_IDX, props.column, e)
			}
			onMouseOver={(e) =>
				props.onMouseOver(COLUMN_HEADER_IDX, props.column, e)
			}
			onContextMenu={(e) =>
				props.onContextMenu(e, COLUMN_HEADER_IDX, props.column)
			}
		>
			{props.name}
		</td>
	);
};

export default ColumnHeader;
