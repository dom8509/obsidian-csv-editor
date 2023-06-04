import React from 'react';

type FunctionType = (...args: any[]) => any;

export interface ColumnSeparatorProps {
	row: number;
	col: number;
	onMouseDown: FunctionType;
	onDoubleClick: FunctionType;
	onContextMenu: FunctionType;
}

const ColumnSeparator: React.FC<ColumnSeparatorProps> = (
	props: ColumnSeparatorProps
) => {
	const className = ["column-separator"].filter((a) => a).join(" ");

	return (
		<td
			className={className}
			onMouseDown={props.onMouseDown}
			onDoubleClick={props.onDoubleClick}
			onTouchEnd={props.onDoubleClick}
			onContextMenu={props.onContextMenu}
		/>
	);
};

export default ColumnSeparator;