import React from 'react';

type FunctionType = () => void;

export interface AddColumnProps {
	onMouseDown: FunctionType;
}

const AddColumnButton: React.FC<AddColumnProps> = (props: AddColumnProps) => {
	const className = ["cell", "read-only", "add-header-btn"]
		.filter((a) => a)
		.join(" ");

	return (
		<th className={className} onMouseDown={props.onMouseDown}>
			+
		</th>
	);
};

export default AddColumnButton;
