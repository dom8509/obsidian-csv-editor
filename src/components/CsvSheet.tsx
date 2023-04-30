import './react-datasheet.css';

import * as React from 'react';

import { CellShapeType } from './CellShape';
import DataSheet from './DataSheet';
import { ValueViewerProps } from './ValueViewer';

type FunctionType = (...args: any[]) => any;

export interface GridElement extends CellShapeType {
	value: string | number | null;
}

export type CsvSheetRowType = Array<GridElement>;
export type CsvSheetDataType = Array<CsvSheetRowType>;
export type CsvSheetColumnType = {
	key?: string;
	name: string;
};

export interface CsvSheetProps {
	columns?: Array<CsvSheetColumnType>;
	data: CsvSheetDataType;
	onDataChanged?: FunctionType;
	onContextMenu?: FunctionType;
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
			onContextMenu={props.onContextMenu}
			className={props.className}
		>
			{props.children}
		</td>
	);
};

export class CsvSheet extends React.Component<CsvSheetProps, CsvSheetState> {
	constructor(props: CsvSheetProps) {
		super(props);
		console.log("In CsvSheet Constructor")
		console.log(props)
		this.state = {
			columns: this.props.columns,
			grid: this.props.data,
		};
	}

	render() {
		const { onContextMenu } = this.props;
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
					//TODO: grid needs to be resized
					console.log("Navigation: entering onCellsChanged");
					console.log(changes);

					console.log("changes.row: ", changes.row);
					console.log("Grid Length: ", this.state.grid.length);
					// if (changes.row >= this.state.grid.length) {
					// 	console.log("New row added to grid");
					// 	console.log("Changed Grid size");
					// } else if (
					// 	this.state.grid.length > 0 &&
					// 	changes.col >= this.state.grid[0].length
					// ) {
					// 	console.log("New column added to grid");
					// }

					const grid = this.state.grid.map((row) => [...row]);
					changes.forEach(({ row, col, value }: ValueViewerProps) => {
						console.log("change");
						console.log(value);
						if (row >= grid.length) {
							console.log("New row added to grid");
							console.log("Changed Grid size");
							const newRow: CsvSheetRowType = Array(
								grid[0].length
							)
								.fill(0)
								.map((_, idx) => {
									const value = {
										row: row,
										col: idx,
										value: "",
									};
									return value;
								});
							grid.push(newRow);
						} else if (grid.length > 0 && col >= grid[0].length) {
							console.log("New column added to grid");
						} else {
							grid[row][col] = { ...grid[row][col], value };
						}
					});
					console.log("Navigation: updating grid");
					this.setState({ grid });
					console.log("Navigation: calling onDataChanged");
					const { onDataChanged } = this.props;
					if (onDataChanged) {
						console.log("Navidation: onDataChanged is defined");
						onDataChanged(changes);
						console.log("Navidation: onDataChanged call returned");
					}

					console.log("Navigation: leaving onCellsChanged");
				}}
				onContextMenu={onContextMenu}
				cellRenderer={cellRenderer}
				autoAddCells={true}
			/>
		);
	}
}
