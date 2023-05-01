import React from 'react';

type FunctionType = () => void;

export interface AddRowProps {
	onMouseDown: FunctionType;
}

export default class AddRow extends React.Component<AddRowProps> {
	render() {
		const { onMouseDown } = this.props;
		const className = ["cell", "read-only", "add-header-btn"]
			.filter((a) => a)
			.join(" ");

		return (
			<td className={className} onMouseDown={onMouseDown}>
				+
			</td>
		);
	}
}
