import React, { ReactNode } from 'react';

import { CellShapeType } from './CellShape';

export interface RowProps {
	row: number;
	cells: Array<CellShapeType>;
	children?: ReactNode;
}

export default class Row extends React.Component<RowProps> {
	render() {
		console.log("Row:")
		console.log(this.props);
		return <tr>{this.props.children}</tr>;
	}
}
