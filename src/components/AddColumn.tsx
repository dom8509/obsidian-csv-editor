import React from 'react';

type FunctionType = () => void;

export interface AddColumnProps {
	onMouseDown: FunctionType;
}

export default class AddColumn extends React.Component<AddColumnProps> {
	render() {
		const { onMouseDown } = this.props;
		const className = ["cell", "read-only", "add-header-btn"]
			.filter((a) => a)
			.join(" ");

		return (
			<th className={className} onMouseDown={onMouseDown}>
				+
			</th>
		);
	}
}
