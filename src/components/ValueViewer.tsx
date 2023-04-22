import React from 'react';

import { CellShapeType } from './CellShape';

export interface ValueViewerProps {
	row: number;
	col: number;
	cell: CellShapeType;
	value: any;
}

export default class ValueViewer extends React.Component<ValueViewerProps> {
	render() {
		const { value } = this.props;
		return <span className="value-viewer">{value}</span>;
	}
}
