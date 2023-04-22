import React, { ReactNode } from 'react';

export interface SheetProps {
	className: string;
	children?: ReactNode;
}

export default class Sheet extends React.Component<SheetProps> {
	render() {
		return (
			<table className={this.props.className}>
				<tbody>{this.props.children}</tbody>
			</table>
		);
	}
}
