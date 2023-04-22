import './react-datasheet.css';

import * as React from 'react';

import { CellShapeType } from './CellShape';
import DataSheet from './DataSheet';
import { ValueViewerProps } from './ValueViewer';

interface GridElement extends CellShapeType {
	value: number | null;
}

export type CsvSheetDataType = Array<Array<GridElement>>;
export type CsvSheetColumnType = {
	key: string;
	name: string;
	width?: string | number;
};

export interface CsvSheetProps {
	columns?: Array<CsvSheetColumnType>;
	data: CsvSheetDataType;
}

interface CsvSheetState {
	columns?: Array<CsvSheetColumnType>;
	grid: CsvSheetDataType;
}

const sheetRenderer: any = (
	data: any,
	columns: Array<CsvSheetColumnType> | undefined
) => {
	// console.log("Data in SheetRenderer:");
	// console.log(data);
	return (
		<table className={data.className + " my-awesome-extra-class"}>
			{columns && (
				<thead>
					<tr>
						<th className="action-cell" />
						{columns.map((col: CsvSheetColumnType) => (
							<th key={col.key}>{col.name}</th>
						))}
					</tr>
				</thead>
			)}
			<tbody>{data.children}</tbody>
		</table>
	);
};

const rowRenderer: any = (data: any) => {
    // console.log("Children:");
    // console.log(data.children);
    // console.log(data)

    // const cellValue: GridElement = {value: data.row + 1};

	return (
		<tr>
			{/* <td>{data.row + 1}</td> */}
			{/* <DataCell
				key={`${data.row}-idx`}
				row={data.row}
				col={0}
				cell={cellValue}
				forceEdit={false}
				onMouseDown={(i: number, j: number, e: MouseEvent) => {}}
				onMouseOver={(i: number, j: number) => {}}
				onDoubleClick={(i: number, j: number) => {}}
				onContextMenu={(evt: MouseEvent, i: number, j: number) => {}}
				onChange={() => {}}
				onRevert={() => {}}
				onNavigate={() => {}}
				onKey={() => {}}
				selected={false}
				editing={false}
				clearing={false}
				// attributesRenderer={attributesRenderer}
				// cellRenderer={cellRenderer}
				valueRenderer={(cell) => {
					// console.log("In valueRenderer");
					return cell.value;
				}}
				// dataRenderer={dataRenderer}
				valueViewer={ValueViewer}
				// dataEditor={dataEditor}
			/> */}
			{data.children}
		</tr>
	);
};

//You can also strongly type all the Components or SFCs that you pass into ReactDataSheet.
const cellRenderer: any = (props: any) => {
	const backgroundStyle =
		props.cell.value && props.cell.value < 0 ? { color: "red" } : undefined;
    const selectedStyle = props.cell.seleted ? {color: "black"} : undefined;
    console.log("Cell props")
    console.log(props)
	return (
		<td
			style={selectedStyle}
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
				sheetRenderer={(props) =>
					sheetRenderer(props, this.state.columns)
				}
				rowRenderer={rowRenderer}
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
				}}
				cellRenderer={cellRenderer}
			/>
		);
	}
}
