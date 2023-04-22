import React, { ReactNode } from 'react';

import { CellShapeType } from './CellShape';

export interface RowProps {
	row: number;
	cells: Array<CellShapeType>;
	children?: ReactNode;
}

export default class Row extends React.Component<RowProps> {
	render() {
		return <tr>{this.props.children}</tr>;
	}
}
