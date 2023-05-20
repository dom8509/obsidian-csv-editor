import React from 'react';

type FunctionType = () => void;

export interface AddRowButtonProps {
	onMouseDown: FunctionType;
}

const AddRowButton: React.FC<AddRowButtonProps> = (
	props: AddRowButtonProps
) => {
	const className = ["cell", "read-only", "add-header-btn"]
		.filter((a) => a)
		.join(" ");

	return (
		<td className={className} onMouseDown={props.onMouseDown}>
			+
		</td>
	);
};

export default AddRowButton;
