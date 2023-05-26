import React from 'react';

// type FunctionType = (...args: any[]) => any;

export interface RowSeparatorProps {
	row: number;
	col: number;
	// 	onMouseDown: FunctionType;
	// 	onDoubleClick: FunctionType;
	// 	onContextMenu: FunctionType;
}

const RowSeparator: React.FC<RowSeparatorProps> = (
	props: RowSeparatorProps
) => {
	const className = ["cell", "row-separator"].filter((a) => a).join(" ");

	return (
		<td
			className={className}
			// onMouseDown={props.handleMouseDown}
			// onDoubleClick={props.handleDoubleClick}
			// onTouchEnd={props.handleDoubleClick}
			// onContextMenu={props.handleContextMenu}
		/>
	);
};

export default RowSeparator;
