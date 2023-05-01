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
					const grid = this.state.grid.map((row) => [...row]);
					changes.forEach(({ row, col, value }: ValueViewerProps) => {
						grid[row][col] = { ...grid[row][col], value };
					});

					this.setState({ grid });

					const { onDataChanged } = this.props;
					if (onDataChanged) {
						onDataChanged(changes);
					}
				}}
				onContextMenu={onContextMenu}
				onRowAdded={() => {
					const grid = this.state.grid.map((row) => [...row]);
					const newRow: CsvSheetRowType = Array(grid[0].length)
						.fill(0)
						.map((_, idx) => {
							const value = {
								row: grid.length + 1,
								col: idx,
								value: "",
							};
							return value;
						});
					grid.push(newRow);

					this.setState({ grid });

					const { onDataChanged } = this.props;
					if (onDataChanged) {
						onDataChanged(newRow);
					}
				}}
				onColumnAdded={() => {
					const numColumns = this.state.grid[0].length;
					const newColumnName = "Neue Spalte " + (numColumns + 1);
					console.log(newColumnName)
					const changes: any[] = [];
					const grid = this.state.grid.map((row, idx) => {
						const newColumn: any = {
							row: idx,
							col: numColumns + 1,
							value: "",
						};
						changes.push(newColumn)
						return [...row, newColumn];
					});

					const columns: Array<CsvSheetColumnType> =
						this.state.columns?.map(
							(column: CsvSheetColumnType) => ({ ...column })
						);
					const newcolumnName: CsvSheetColumnType = {
						name: newColumnName,
					};
					columns.push(newcolumnName);
					this.setState({ columns, grid });

					const { onDataChanged } = this.props;
					if (onDataChanged) {
						onDataChanged(changes);
					}
				}}
				cellRenderer={cellRenderer}
				autoAddCells={true}
			/>
		);
	}
}
