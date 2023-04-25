import './react-datasheet.css';

import * as React from 'react';

import { CellShapeType } from './CellShape';
import DataSheet from './DataSheet';
import { ValueViewerProps } from './ValueViewer';

type FunctionType = (...args: any[]) => any;

export interface GridElement extends CellShapeType {
	value: number | null;
}

export type CsvSheetDataType = Array<Array<GridElement>>;
export type CsvSheetColumnType = {
	key?: string;
	name: string;
};

export interface CsvSheetProps {
	columns?: Array<CsvSheetColumnType>;
	data: CsvSheetDataType;
	onDataChanged?: FunctionType;
}

interface CsvSheetState {
	columns?: Array<CsvSheetColumnType>;
	grid: CsvSheetDataType;
}
//You can also strongly type all the Components or SFCs that you pass into ReactDataSheet.
const cellRenderer: any = (props: any) => {
	const backgroundStyle =
		props.cell.value && props.cell.value < 0 ? { color: "red" } : undefined;

	return (
		<td
			style={backgroundStyle}
			onMouseDown={props.onMouseDown}
			onMouseOver={props.onMouseOver}
			onDoubleClick={props.onDoubleClick}
			className={props.className}
		>
			{props.children}
		</td>
	);
};

export class CsvSheet extends React.Component<CsvSheetProps, CsvSheetState> {
	constructor(props: CsvSheetProps) {
		super(props);
		this.state = {
			columns: this.props.columns,
			grid: this.props.data,
		};
	}

	render() {
		return (
			//TODO: Handle empty data
			<DataSheet
				data={this.state.grid}
				columns={this.state.columns}
				valueRenderer={(cell) => {
					// console.log("In valueRenderer");
					return cell.value;
				}}
				onSelect={(cell) => console.log("selected")}
				onCellsChanged={(changes) => {
					console.log("In onCellsChanged");
					const grid = this.state.grid.map((row) => [...row]);
					changes.forEach(({ row, col, value }: ValueViewerProps) => {
						grid[row][col] = { ...grid[row][col], value };
					});
					this.setState({ grid });
					this.props.onDataChanged &&
						this.props.onDataChanged(changes);
				}}
				cellRenderer={cellRenderer}
			/>
		);
	}
}
