import React from 'react';

type FunctionType = () => void;

export interface AddColumnButtonProps {
	onMouseDown: FunctionType;
}

const AddColumnButton: React.FC<AddColumnButtonProps> = (props: AddColumnButtonProps) => {
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
